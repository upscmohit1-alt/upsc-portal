import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { prompt_text } = await request.json()
  await supabase.from('prompts')
    .update({ prompt_text, updated_at: new Date().toISOString() })
    .eq('id', params.id)
  return NextResponse.json({ success: true })
}
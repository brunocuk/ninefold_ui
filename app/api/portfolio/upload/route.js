// app/api/portfolio/upload/route.js
// Uploads portfolio media to the public 'portfolio' storage bucket.
// Uses the service role key server-side, so no storage RLS policies are needed.

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nedostaje datoteka' }, { status: 400 });
    }

    const folder = (formData.get('folder') || 'general').toString().replace(/[^a-zA-Z0-9-_]/g, '');
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const safeBase = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .slice(0, 60);
    const path = `${folder}/${Date.now()}-${safeBase}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from('portfolio')
      .upload(path, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabase.storage.from('portfolio').getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

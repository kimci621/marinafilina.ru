import { NextRequest, NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/content';

export async function GET() {
  try {
    const content = await getContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.nav || !body.home || !body.about || !body.projects || !body.footer) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    await updateContent(body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.code === 'EROFS') {
      return NextResponse.json({ error: 'Сохранение недоступно в production. Редактируйте локально и делайте deploy.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}

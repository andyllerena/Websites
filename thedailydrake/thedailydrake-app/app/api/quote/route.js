import loadLyrics from '@/lib/loadLyrics';

export async function GET() {
  const lyrics = await loadLyrics();
  const randomIndex = Math.floor(Math.random() * lyrics.length);
  const quote = lyrics[randomIndex];

  return Response.json({ lyric: quote });
}

export function GET() {
  const content = `Contact: mailto:security@veridiancare.in
Expires: 2027-12-31T23:59:59.000Z
Preferred-Languages: en, hi
Canonical: https://veridiancare.vercel.app/.well-known/security.txt
Policy: https://veridiancare.vercel.app/privacy
Acknowledgments: https://veridiancare.vercel.app/about
Hiring: https://veridiancare.vercel.app/contact
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

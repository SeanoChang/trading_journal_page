import ClientWrapper from "./ClientWrapper";

export default async function PostPage({
  params,
}: {
  params: Promise<{ pair: string; date: string }>;
}) {
  const { pair, date } = await params;

  return <ClientWrapper pair={pair} date={date} />;
}

import Logo from '@/components/navigation/Logo'
import Nav from '@/components/navigation/Nav'
import Hero from '@/components/home/Hero'
import AllArtwork from '@components/home/AllArtwork';

export default async function Page() {

  return (
    <main>
      <Logo />
      <Nav />
      <Hero />
      <AllArtwork />
    </main>
  );
}
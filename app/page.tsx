import Main from './_v2/Main';
import Mobile from './_v2/Mobile';

export default function Home() {
  return (
    <main id="main">
      <div className="v2-wide">
        <Main />
      </div>
      <div className="v2-narrow">
        <Mobile />
      </div>
    </main>
  );
}

import { eventConfig } from '../config';
import { Bow, Icon, TinyStar } from './Artwork';

export function Closing({ onReplay }: { onReplay: () => void }) {
  return (
    <>
      <section className="closing section-space" aria-labelledby="closing-title">
        <div className="closing-art" aria-hidden="true">
          <Bow color="cream" />
          <TinyStar className="closing-star left" />
          <TinyStar className="closing-star right" />
        </div>
        <h2 id="closing-title">
          Найкращі моменти —<br />
          ті, які ми розділяємо
          <br />
          <em>з близькими.</em>
        </h2>
        <p className="closing-message">З нетерпінням чекаємо на вас!</p>
        <p className="closing-signature">
          {eventConfig.hosts}
          <span>та одне маленьке диво ♡</span>
        </p>
        <a href="#home" className="back-to-top" aria-label="Повернутися на початок">
          <Icon name="down" size={18} />
        </a>
      </section>
      <footer className="footer">
        <a href="#home" className="wordmark">
          <Icon name="bow" size={24} />
          <span>маленький секрет</span>
        </a>
        <button className="replay-button" onClick={onReplay}>
          <Icon name="replay" size={15} />
          Відкрити запрошення ще раз
        </button>
      </footer>
    </>
  );
}

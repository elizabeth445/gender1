import { eventConfig } from '../config';
import { Bow, Icon, TinyStar } from './Artwork';

export function Story() {
  return (
    <section className="story section-space" id="story" aria-labelledby="story-title">
      <div className="story-heading reveal">
        <h2 id="story-title">
          Наша любов
          <br />
          має <em>продовження.</em>
        </h2>
        <div className="story-ornament">
          <Icon name="heart" size={18} />
          <span />
          <Icon name="heart" size={12} />
        </div>
      </div>
      <div className="story-letter reveal">
        <div className="letter-embellishment" aria-hidden="true">
          <Icon name="heart" className="letter-heart-outline" size={94} />
          <TinyStar className="letter-star" />
          <svg className="letter-paper-heart" viewBox="0 0 110 110" fill="none">
            <path d="M55 92C-7 57 12 5 46 24l9 8 9-8C98 5 117 57 55 92Z" fill="#e8d0d0" />
            <path d="M55 32v60C20 69 24 41 46 24Z" fill="#f4e4df" />
            <path d="M55 32v60" stroke="#c4a7a2" opacity=".45" />
          </svg>
        </div>
        <p>
          Є новини, від яких серце б’ється частіше.{' '}
          <br />І є люди, з якими хочеться розділити їх першими.
        </p>
        <p>
          Зовсім скоро в нашому житті з’явиться маленька людина. Ми ще не знаємо, чиї будуть ці
          крихітні долоньки, але вже знаємо: любові стане більше.
        </p>
        <p>Приходьте обійнятися, пофантазувати й разом відкрити наш найніжніший секрет.</p>
        <div className="letter-signature">
          <Bow />
          <span>
            З любов’ю,
            <br />
            <em>{eventConfig.hosts}</em>
          </span>
        </div>
      </div>
    </section>
  );
}

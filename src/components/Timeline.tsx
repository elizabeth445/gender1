import { eventConfig } from '../config';
import { CelebrationStillLife, Icon } from './Artwork';

export function Timeline() {
  return (
    <section
      className="timeline-section section-space"
      id="schedule"
      aria-labelledby="schedule-title"
    >
      <div className="timeline-layout">
        <div className="timeline-intro reveal">
          <h2 id="schedule-title">
            План на
            <br />
            <em>щасливий день.</em>
          </h2>
          <p>
            Трошки хвилювання, багато обіймів
            <br />і один дуже особливий момент.
          </p>
          <CelebrationStillLife />
        </div>
        <ol className="timeline-list">
          {eventConfig.schedule.map((item, index) => (
            <li className={`timeline-item ${index === 3 ? 'main-surprise' : ''}`} key={item.time}>
              <time className="timeline-time">{item.time}</time>
              <span className="timeline-marker">
                <Icon name={item.icon} size={21} />
              </span>
              <div className="timeline-text">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

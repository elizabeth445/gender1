import { useRef, useState, type FormEvent } from 'react';
import { deadlineLabel } from '../config';
import { readLocal, writeLocal } from '../lib';
import { Bow, Icon } from './Artwork';

type Response = { name: string; attendance: 'yes' | 'no'; wishes: string; savedAt: string };
function isResponse(value: unknown): value is Response {
  if (!value || typeof value !== 'object') return false;
  const response = value as Partial<Response>;
  return (
    typeof response.name === 'string' &&
    response.name.trim().length >= 2 &&
    response.name.length <= 70 &&
    (response.attendance === 'yes' || response.attendance === 'no') &&
    typeof response.wishes === 'string' &&
    response.wishes.length <= 500 &&
    typeof response.savedAt === 'string'
  );
}

export function RSVP() {
  const [response, setResponse] = useState<Response | null>(() => readLocal('rsvp', isResponse));
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(response?.name ?? '');
  const [attendance, setAttendance] = useState<'yes' | 'no' | null>(response?.attendance ?? null);
  const [wishes, setWishes] = useState(response?.wishes ?? '');
  const [errors, setErrors] = useState<{ name?: string; attendance?: string }>({});
  const [storageError, setStorageError] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = {
      name: name.trim().length < 2 ? 'Введіть своє ім’я — щонайменше 2 символи.' : undefined,
      attendance: !attendance ? 'Оберіть, чи зможете ви бути з нами.' : undefined,
    };
    setErrors(nextErrors);
    if (nextErrors.attendance || nextErrors.name) {
      const target = nextErrors.attendance ? 'input[name="attendance"]' : '#guest-name';
      form.current?.querySelector<HTMLElement>(target)?.focus();
      return;
    }
    if (!attendance) return;
    const next = {
      name: name.trim(),
      attendance,
      wishes: wishes.trim(),
      savedAt: new Date().toISOString(),
    };
    setStorageError(!writeLocal('rsvp', next));
    setResponse(next);
    setEditing(false);
    requestAnimationFrame(() => success.current?.focus({ preventScroll: true }));
  };
  const edit = () => {
    setEditing(true);
    requestAnimationFrame(() =>
      form.current?.querySelector<HTMLInputElement>('#guest-name')?.focus({ preventScroll: true }),
    );
  };

  return (
    <section className="rsvp-section section-space" id="rsvp" aria-labelledby="rsvp-title">
      <div className="rsvp-layout">
        <div className="rsvp-intro">
          <h2 id="rsvp-title">
            Ви будете
            <br />
            <em>з нами?</em>
          </h2>
          <p>
            Наш день стане ще теплішим,
            <br />
            якщо ви розділите його з нами.
          </p>
          <div className="rsvp-deadline">
            <Icon name="heart" size={18} />
            <span>
              Дайте знати до <strong>{deadlineLabel}</strong>
            </span>
          </div>
          <Bow color="rose" className="rsvp-bow" />
        </div>
        <div className="rsvp-paper">
          {response && !editing ? (
            <div className="rsvp-success" ref={success} tabIndex={-1} role="status">
              <span className="success-heart">
                <Icon name="heart" size={31} />
              </span>
              <h3>
                {response.attendance === 'yes' ? 'До зустрічі,' : 'Дякуємо вам,'}
                <br />
                <em>{response.name}!</em>
              </h3>
              <p>
                {response.attendance === 'yes'
                  ? 'Тепер у цього дня є ще одна причина бути особливим ♡'
                  : 'Подумки ви будете поруч. Дякуємо за ваші теплі почуття ♡'}
              </p>
              {response.wishes && <blockquote>{response.wishes}</blockquote>}
              <button className="button button-outline" onClick={edit}>
                Змінити відповідь <Icon name="edit" size={16} />
              </button>
              {storageError && (
                <p className="storage-warning">
                  Браузер не дозволив зберегти відповідь. Вона доступна лише до закриття сторінки.
                </p>
              )}
            </div>
          ) : (
            <form ref={form} onSubmit={submit} noValidate>
              <fieldset
                className="attendance-fieldset"
                aria-describedby={errors.attendance ? 'attendance-error' : undefined}
                aria-invalid={!!errors.attendance}
              >
                <legend>
                  Чи зможете ви прийти? <span aria-hidden="true">*</span>
                </legend>
                <div className="attendance-options">
                  {(['yes', 'no'] as const).map((value) => (
                    <label
                      key={value}
                      className={`attendance-option ${attendance === value ? 'checked' : ''}`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={attendance === value}
                        onChange={() => {
                          setAttendance(value);
                          setErrors((prev) => ({ ...prev, attendance: undefined }));
                        }}
                        required
                      />
                      <span className="radio-indicator" />
                      <span>{value === 'yes' ? 'Так, із радістю!' : 'На жаль, не зможу'}</span>
                    </label>
                  ))}
                </div>
                {errors.attendance && (
                  <p className="field-error" role="alert" id="attendance-error">
                    {errors.attendance}
                  </p>
                )}
              </fieldset>
              <div className="form-field">
                <label htmlFor="guest-name">
                  Ваше ім’я <span aria-hidden="true">*</span>
                </label>
                <input
                  id="guest-name"
                  name="name"
                  placeholder="Як до вас звертатися?"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={70}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p className="field-error" role="alert" id="name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="guest-wishes">
                  Кілька теплих слів <span className="optional">за бажанням</span>
                </label>
                <textarea
                  id="guest-wishes"
                  name="wishes"
                  placeholder="Залиште побажання для нашого маленького дива…"
                  value={wishes}
                  onChange={(event) => setWishes(event.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <button className="button button-dark rsvp-submit" type="submit">
                {editing ? 'Зберегти зміни' : 'Зберегти мою відповідь'}
                <Icon name="arrow" size={19} />
              </button>
            </form>
          )}
          <p className="local-notice">
            <Icon name="heart" size={13} />
            <span>Відповідь зберігається у вашому браузері й не надсилається організаторам.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

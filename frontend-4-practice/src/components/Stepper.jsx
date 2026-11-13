import { Fragment } from 'react';

const STEPS = ['Мастер', 'Услуга', 'Дата и время', 'Контакты', 'Готово!'];
const ACTIVE_STEP = 3; // номер активного шага (с 1)

function Stepper() {
  return (
    <section className="stepper-bar" aria-label="Этапы записи">
      <div className="container stepper-inner">
        {STEPS.map((label, index) => {
          const number = index + 1;
          let status = '';
          if (number < ACTIVE_STEP) status = ' done';
          if (number === ACTIVE_STEP) status = ' active';

          return (
            <Fragment key={label}>
              <div className={`step-node${status}`}>
                <span className="step-circle">{number}</span>
                <span className="step-label">{label}</span>
              </div>
              {number < STEPS.length && <span className="step-line"></span>}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}

export default Stepper;

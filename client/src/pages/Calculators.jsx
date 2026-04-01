import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Calculators.css';

const TABS = {
  BMI: 'bmi',
  TDEE: 'tdee',
  MACRO: 'macro',
};

const TAB_FROM_PARAM = {
  bmi: TABS.BMI,
  tdee: TABS.TDEE,
  macro: TABS.MACRO,
  macros: TABS.MACRO,
};

const ACTIVITY_OPTIONS = [
  { value: '1.2', label: 'Мінімальна (без тренувань)' },
  { value: '1.375', label: 'Низька (1-3 тренувань/тиждень)' },
  { value: '1.55', label: 'Середня (3-5 тренувань/тиждень)' },
  { value: '1.725', label: 'Висока (6-7 тренувань/тиждень)' },
  { value: '1.9', label: 'Дуже висока (2 тренування/день)' },
];

const MACRO_GOALS = [
  { value: 'cut', label: 'Схуднення (дефіцит)' },
  { value: 'maintain', label: 'Підтримання ваги' },
  { value: 'bulk', label: "Набір м'язової маси" },
];

const BMI_SCALE = [
  { id: 'underweight', range: '< 18.5', label: 'Недостатня вага', color: '#3b82f6' },
  { id: 'normal', range: '18.5 – 24.9', label: 'Нормальна вага', color: '#22c55e' },
  { id: 'overweight', range: '25 – 29.9', label: 'Надлишкова вага', color: '#f59e0b' },
  { id: 'obese', range: '≥ 30', label: 'Ожиріння', color: '#ef4444' },
];

const MACRO_TIPS = {
  cut: "При дефіциті калорій підтримуйте високе споживання білка для збереження м'язової маси. Розподіліть прийоми їжі на 4-5 разів на день.",
  maintain:
    "Для підтримки ваги дотримуйтесь збалансованого співвідношення макронутрієнтів. Білок забезпечить відновлення та підтримку м'язів.",
  bulk: 'Для набору маси забезпечте профіцит калорій та рівномірне споживання білка протягом дня. Вуглеводи — ключове джерело енергії для тренувань.',
};

const BMI_CATEGORY_TO_SCALE_ID = {
  'Недостатня вага': 'underweight',
  Норма: 'normal',
  'Надлишкова вага': 'overweight',
  Ожиріння: 'obese',
};

const BMI_DISPLAY_NAME = {
  'Недостатня вага': 'Недостатня вага',
  Норма: 'Нормальна вага',
  'Надлишкова вага': 'Надлишкова вага',
  Ожиріння: 'Ожиріння',
};

function Calculators() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const resolvedTab = TAB_FROM_PARAM[tabParam];
  const [activeTab, setActiveTab] = useState(resolvedTab || TABS.BMI);
  const [prevTabParam, setPrevTabParam] = useState(tabParam);

  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (resolvedTab) {
      setActiveTab(resolvedTab);
    }
  }

  /* ── TDEE state ── */
  const [sex, setSex] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const [tdeeError, setTdeeError] = useState(null);
  const [bmrResult, setBmrResult] = useState(null);

  /* ── BMI state ── */
  const [bmiHeight, setBmiHeight] = useState('');
  const [bmiWeight, setBmiWeight] = useState('');
  const [bmiError, setBmiError] = useState(null);
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState(null);

  /* ── Macro state ── */
  const [macroWeight, setMacroWeight] = useState('');
  const [macroCalories, setMacroCalories] = useState('');
  const [macroGoal, setMacroGoal] = useState('maintain');
  const [proteinPerKg, setProteinPerKg] = useState('1.8');
  const [fatPerKg, setFatPerKg] = useState('0.8');
  const [macroError, setMacroError] = useState(null);
  const [macroResult, setMacroResult] = useState(null);

  /* ── Helpers ── */
  const parsePositive = (value) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const validateRange = (value, min, max, fieldName) => {
    if (value < min || value > max) {
      return `${fieldName} має бути в діапазоні ${min}–${max}`;
    }
    return null;
  };

  /* ── TDEE ── */
  const updateMacroCaloriesFromGoal = (goal, cutCal, maintainCal, bulkCal) => {
    const goalCalories = { cut: cutCal, maintain: maintainCal, bulk: bulkCal };
    setMacroCalories(String(goalCalories[goal] || maintainCal));
  };

  const handleTdeeCalculate = () => {
    setTdeeError(null);
    const w = parsePositive(weight);
    const h = parsePositive(height);
    const a = parsePositive(age);
    const factor = parsePositive(activity);

    if (!w || !h || !a || !factor) {
      setTdeeError('Усі значення мають бути додатними числами');
      setBmrResult(null);
      return;
    }

    const weightErr = validateRange(w, 30, 250, 'Вага');
    const heightErr = validateRange(h, 120, 230, 'Зріст');
    const ageErr = validateRange(a, 10, 90, 'Вік');
    if (weightErr || heightErr || ageErr) {
      setTdeeError(weightErr || heightErr || ageErr);
      setBmrResult(null);
      return;
    }

    const bmr = 10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161);
    const tdee = bmr * factor;
    const bmrRounded = Math.round(bmr);
    const tdeeRounded = Math.round(tdee);
    const cutCalories = Math.round(tdee * 0.85);
    const bulkCalories = Math.round(tdee * 1.1);

    setBmrResult({
      bmr: bmrRounded,
      tdee: tdeeRounded,
      cut: cutCalories,
      maintain: tdeeRounded,
      bulk: bulkCalories,
    });

    if (!macroWeight) setMacroWeight(String(w));
    updateMacroCaloriesFromGoal(macroGoal, cutCalories, tdeeRounded, bulkCalories);
  };

  const handleTdeeReset = () => {
    setSex('male');
    setAge('');
    setHeight('');
    setWeight('');
    setActivity('1.55');
    setTdeeError(null);
    setBmrResult(null);
  };

  /* ── BMI ── */
  const handleBmiCalculate = () => {
    setBmiError(null);
    const w = parsePositive(bmiWeight);
    const h = parsePositive(bmiHeight);

    if (!w || !h) {
      setBmiError('Вага та зріст мають бути додатними числами');
      setBmiResult(null);
      setBmiCategory(null);
      return;
    }

    const weightErr = validateRange(w, 30, 250, 'Вага');
    const heightErr = validateRange(h, 120, 230, 'Зріст');
    if (weightErr || heightErr) {
      setBmiError(weightErr || heightErr);
      setBmiResult(null);
      setBmiCategory(null);
      return;
    }

    const hMeters = h / 100;
    const bmi = w / (hMeters * hMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;

    let category = 'Норма';
    if (bmiRounded < 18.5) category = 'Недостатня вага';
    else if (bmiRounded >= 25 && bmiRounded < 30) category = 'Надлишкова вага';
    else if (bmiRounded >= 30) category = 'Ожиріння';

    setBmiResult(bmiRounded);
    setBmiCategory(category);
  };

  const handleBmiReset = () => {
    setBmiHeight('');
    setBmiWeight('');
    setBmiError(null);
    setBmiResult(null);
    setBmiCategory(null);
  };

  /* ── Macros ── */
  const handleMacroCalculate = () => {
    setMacroError(null);
    const w = parsePositive(macroWeight);
    const calories = parsePositive(macroCalories);
    const proteinKg = parsePositive(proteinPerKg);
    const fatKg = parsePositive(fatPerKg);

    if (!w || !calories || !proteinKg || !fatKg) {
      setMacroError('Усі значення мають бути додатними числами');
      setMacroResult(null);
      return;
    }

    const weightErr = validateRange(w, 30, 250, 'Вага');
    const caloriesErr = validateRange(calories, 800, 6000, 'Калорії');
    if (weightErr || caloriesErr) {
      setMacroError(weightErr || caloriesErr);
      setMacroResult(null);
      return;
    }

    const proteinG = w * proteinKg;
    const fatG = w * fatKg;
    const proteinCal = proteinG * 4;
    const fatCal = fatG * 9;
    const carbsCal = Math.max(0, calories - proteinCal - fatCal);
    const carbsG = carbsCal / 4;

    setMacroResult({
      proteinG: Math.round(proteinG * 10) / 10,
      fatG: Math.round(fatG * 10) / 10,
      carbsG: Math.round(carbsG * 10) / 10,
    });
  };

  const handleMacroGoalChange = (goal) => {
    setMacroGoal(goal);
    const macroDefaults = {
      cut: { protein: '2.0', fat: '0.8' },
      maintain: { protein: '1.8', fat: '0.8' },
      bulk: { protein: '1.8', fat: '1.0' },
    };
    const defaults = macroDefaults[goal];
    setProteinPerKg(defaults.protein);
    setFatPerKg(defaults.fat);

    if (bmrResult && typeof bmrResult === 'object') {
      const goalCalories = {
        cut: bmrResult.cut,
        maintain: bmrResult.maintain,
        bulk: bmrResult.bulk,
      };
      setMacroCalories(String(goalCalories[goal] || bmrResult.maintain));
    }
  };

  const handleMacroReset = () => {
    setMacroWeight('');
    setMacroCalories('');
    setMacroGoal('maintain');
    setProteinPerKg('1.8');
    setFatPerKg('0.8');
    setMacroError(null);
    setMacroResult(null);
  };

  /* ── Derived values for macro display ── */
  const macroDist = macroResult
    ? (() => {
        const pCal = macroResult.proteinG * 4;
        const fCal = macroResult.fatG * 9;
        const cCal = macroResult.carbsG * 4;
        const total = pCal + fCal + cCal;
        const pct = (v) => (total > 0 ? Math.round((v / total) * 100) : 0);
        return {
          protein: { g: macroResult.proteinG, kcal: Math.round(pCal), pct: pct(pCal) },
          fat: { g: macroResult.fatG, kcal: Math.round(fCal), pct: pct(fCal) },
          carbs: { g: macroResult.carbsG, kcal: Math.round(cCal), pct: pct(cCal) },
        };
      })()
    : null;

  const bmiScaleId = bmiCategory ? BMI_CATEGORY_TO_SCALE_ID[bmiCategory] : null;

  const bmiCanSubmit = bmiWeight.trim() !== '' && bmiHeight.trim() !== '';
  const tdeeCanSubmit =
    weight.trim() !== '' &&
    height.trim() !== '' &&
    age.trim() !== '' &&
    (sex === 'male' || sex === 'female') &&
    activity.trim() !== '';
  const macroCanSubmit =
    macroCalories.trim() !== '' && macroWeight.trim() !== '' && macroGoal.trim() !== '';

  return (
    <div className="calc-page">
      {/* ── HERO ── */}
      <section className="calc-hero calc-hero--centered">
        <div className="calc-hero__glow" />
        <div className="calc-hero__content">
          <div className="calc-hero__icon-box">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <rect
                x="7"
                y="5"
                width="10"
                height="4"
                rx="1"
                fill="currentColor"
                opacity="0.3"
                stroke="none"
              />
              <line x1="8" y1="13" x2="8.01" y2="13" strokeWidth="2" />
              <line x1="12" y1="13" x2="12.01" y2="13" strokeWidth="2" />
              <line x1="16" y1="13" x2="16.01" y2="13" strokeWidth="2" />
              <line x1="8" y1="17" x2="8.01" y2="17" strokeWidth="2" />
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
              <line x1="16" y1="17" x2="16.01" y2="17" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="calc-hero__title">Калькулятори</h1>
            <p className="calc-hero__subtitle">
              Розрахуйте індекс маси тіла, добову норму калорій та оптимальне співвідношення
              макронутрієнтів для ваших цілей.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="calc-body">
        {/* Tabs */}
        <div className="calc-tabs">
          {[
            { id: TABS.BMI, label: 'BMI' },
            { id: TABS.TDEE, label: 'TDEE' },
            { id: TABS.MACRO, label: 'Макроси' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`calc-tabs__btn${activeTab === tab.id ? ' calc-tabs__btn--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Calculator Panel ── */}
        <div className="calc-panel">
          <div className="calc-tab-panel" key={activeTab}>
            {/* ════════ BMI ════════ */}
            {activeTab === TABS.BMI && (
              <>
                <h2 className="calc-panel__title">Калькулятор індексу маси тіла (BMI)</h2>
                <p className="calc-panel__desc">
                  Розрахуйте свій індекс маси тіла на основі зросту та ваги
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleBmiCalculate();
                  }}
                >
                  <div className="calc-panel__fields">
                    <div className="calc-panel__row">
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-bmi-weight">
                          Вага (кг)
                        </label>
                        <input
                          id="calc-bmi-weight"
                          className="calc-panel__input"
                          type="number"
                          value={bmiWeight}
                          onChange={(e) => setBmiWeight(e.target.value)}
                          placeholder="78"
                          min="20"
                        />
                      </div>
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-bmi-height">
                          Зріст (см)
                        </label>
                        <input
                          id="calc-bmi-height"
                          className="calc-panel__input"
                          type="number"
                          value={bmiHeight}
                          onChange={(e) => setBmiHeight(e.target.value)}
                          placeholder="188"
                          min="50"
                        />
                      </div>
                    </div>
                  </div>

                  {bmiError && <div className="calc-panel__error">{bmiError}</div>}

                  <div className="calc-panel__actions">
                    <button
                      className="calc-panel__btn calc-panel__btn--primary"
                      type="submit"
                      disabled={!bmiCanSubmit}
                    >
                      Розрахувати BMI
                    </button>
                    <button
                      className="calc-panel__btn calc-panel__btn--secondary"
                      type="button"
                      onClick={handleBmiReset}
                    >
                      Скинути
                    </button>
                  </div>
                </form>

                {bmiResult != null && (
                  <div className="calc-result">
                    <div className="calc-bmi">
                      <p className="calc-bmi__label">Ваш BMI:</p>
                      <p className="calc-bmi__value">{bmiResult}</p>
                      <p className={`calc-bmi__status calc-bmi__status--${bmiScaleId}`}>
                        {BMI_DISPLAY_NAME[bmiCategory]}
                      </p>
                    </div>

                    <div className="calc-bmi-scale">
                      {BMI_SCALE.map((cat) => (
                        <div
                          key={cat.id}
                          className={`calc-bmi-scale__item${bmiScaleId === cat.id ? ' calc-bmi-scale__item--active' : ''}`}
                          style={
                            /** @type {import('react').CSSProperties} */ (
                              Object.assign({}, { '--scale-color': cat.color })
                            )
                          }
                        >
                          <span className="calc-bmi-scale__range">{cat.range}</span>
                          <span className="calc-bmi-scale__label">{cat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ════════ TDEE ════════ */}
            {activeTab === TABS.TDEE && (
              <>
                <h2 className="calc-panel__title">Калькулятор денних калорій (TDEE)</h2>
                <p className="calc-panel__desc">
                  Розрахуйте вашу добову норму калорій з урахуванням активності
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTdeeCalculate();
                  }}
                >
                  <div className="calc-panel__fields">
                    <div className="calc-panel__row">
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-tdee-weight">
                          Вага (кг)
                        </label>
                        <input
                          id="calc-tdee-weight"
                          className="calc-panel__input"
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="78"
                          min="20"
                        />
                      </div>
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-tdee-height">
                          Зріст (см)
                        </label>
                        <input
                          id="calc-tdee-height"
                          className="calc-panel__input"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="188"
                          min="50"
                        />
                      </div>
                    </div>

                    <div className="calc-panel__row">
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-tdee-age">
                          Вік
                        </label>
                        <input
                          id="calc-tdee-age"
                          className="calc-panel__input"
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="21"
                          min="1"
                        />
                      </div>
                      <div className="calc-panel__field">
                        <div id="calc-tdee-sex-heading" className="calc-panel__label">
                          Стать
                        </div>
                        <div
                          role="group"
                          aria-labelledby="calc-tdee-sex-heading"
                          className="calc-panel__toggle-group"
                        >
                          <button
                            type="button"
                            className={`calc-panel__toggle${sex === 'male' ? ' calc-panel__toggle--active' : ''}`}
                            onClick={() => setSex('male')}
                          >
                            Чоловік
                          </button>
                          <button
                            type="button"
                            className={`calc-panel__toggle${sex === 'female' ? ' calc-panel__toggle--active' : ''}`}
                            onClick={() => setSex('female')}
                          >
                            Жінка
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="calc-panel__field">
                      <label className="calc-panel__label" htmlFor="calc-tdee-activity">
                        Рівень активності
                      </label>
                      <select
                        id="calc-tdee-activity"
                        className="calc-panel__select"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                      >
                        {ACTIVITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {tdeeError && <div className="calc-panel__error">{tdeeError}</div>}

                  <div className="calc-panel__actions">
                    <button
                      className="calc-panel__btn calc-panel__btn--primary"
                      type="submit"
                      disabled={!tdeeCanSubmit}
                    >
                      Розрахувати TDEE
                    </button>
                    <button
                      className="calc-panel__btn calc-panel__btn--secondary"
                      type="button"
                      onClick={handleTdeeReset}
                    >
                      Скинути
                    </button>
                  </div>
                </form>

                {bmrResult && (
                  <div className="calc-result">
                    <div className="calc-tdee-main">
                      <p className="calc-tdee-main__label">Ваша добова норма (TDEE):</p>
                      <p className="calc-tdee-main__value">
                        {bmrResult.tdee} <span className="calc-tdee-main__unit">ккал/день</span>
                      </p>
                      <p className="calc-tdee-main__bmr">
                        Базовий метаболізм (BMR): {bmrResult.bmr} ккал
                      </p>
                    </div>

                    <div className="calc-tdee-cards">
                      <div className="calc-tdee-card calc-tdee-card--cut">
                        <span className="calc-tdee-card__label">Для схуднення</span>
                        <span className="calc-tdee-card__value">{bmrResult.cut}</span>
                        <span className="calc-tdee-card__unit">ккал/день</span>
                        <span className="calc-tdee-card__note">−15% від TDEE</span>
                      </div>
                      <div className="calc-tdee-card calc-tdee-card--maintain">
                        <span className="calc-tdee-card__label">Підтримка</span>
                        <span className="calc-tdee-card__value">{bmrResult.maintain}</span>
                        <span className="calc-tdee-card__unit">ккал/день</span>
                        <span className="calc-tdee-card__note">Поточний TDEE</span>
                      </div>
                      <div className="calc-tdee-card calc-tdee-card--bulk">
                        <span className="calc-tdee-card__label">Для набору</span>
                        <span className="calc-tdee-card__value">{bmrResult.bulk}</span>
                        <span className="calc-tdee-card__unit">ккал/день</span>
                        <span className="calc-tdee-card__note">+10% до TDEE</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ════════ MACROS ════════ */}
            {activeTab === TABS.MACRO && (
              <>
                <h2 className="calc-panel__title">Калькулятор макронутрієнтів</h2>
                <p className="calc-panel__desc">Розрахуйте розподіл білків, жирів та вуглеводів</p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleMacroCalculate();
                  }}
                >
                  <div className="calc-panel__fields">
                    <div className="calc-panel__field">
                      <label className="calc-panel__label" htmlFor="calc-macro-calories">
                        Денна норма калорій
                      </label>
                      <input
                        id="calc-macro-calories"
                        className="calc-panel__input"
                        type="number"
                        value={macroCalories}
                        onChange={(e) => setMacroCalories(e.target.value)}
                        placeholder="2800"
                        min="500"
                      />
                      <span className="calc-panel__helper">
                        Використайте TDEE калькулятор для точного розрахунку
                      </span>
                    </div>

                    <div className="calc-panel__row">
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-macro-weight">
                          Вага (кг)
                        </label>
                        <input
                          id="calc-macro-weight"
                          className="calc-panel__input"
                          type="number"
                          value={macroWeight}
                          onChange={(e) => setMacroWeight(e.target.value)}
                          placeholder="78"
                          min="20"
                        />
                      </div>
                      <div className="calc-panel__field">
                        <label className="calc-panel__label" htmlFor="calc-macro-goal">
                          Мета
                        </label>
                        <select
                          id="calc-macro-goal"
                          className="calc-panel__select"
                          value={macroGoal}
                          onChange={(e) => handleMacroGoalChange(e.target.value)}
                        >
                          {MACRO_GOALS.map((g) => (
                            <option key={g.value} value={g.value}>
                              {g.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {macroError && <div className="calc-panel__error">{macroError}</div>}

                  <div className="calc-panel__actions">
                    <button
                      className="calc-panel__btn calc-panel__btn--primary"
                      type="submit"
                      disabled={!macroCanSubmit}
                    >
                      Розрахувати макроси
                    </button>
                    <button
                      className="calc-panel__btn calc-panel__btn--secondary"
                      type="button"
                      onClick={handleMacroReset}
                    >
                      Скинути
                    </button>
                  </div>
                </form>

                {macroDist && (
                  <div className="calc-result">
                    <p className="calc-result__header">Ваші макронутрієнти:</p>

                    <div className="calc-macro-result">
                      {[
                        { key: 'protein', name: 'Білки', data: macroDist.protein },
                        { key: 'fat', name: 'Жири', data: macroDist.fat },
                        { key: 'carbs', name: 'Вуглеводи', data: macroDist.carbs },
                      ].map((m) => (
                        <div key={m.key} className="calc-macro-item">
                          <div className="calc-macro-tooltip" aria-hidden="true">
                            {m.name}: {m.data.g} г / {m.data.kcal} ккал / {m.data.pct}%
                          </div>
                          <div className="calc-macro-item__header">
                            <span className="calc-macro-item__name">{m.name}</span>
                            <span className="calc-macro-item__value">{m.data.g}г</span>
                          </div>
                          <div className="calc-macro-item__bar">
                            <div
                              className={`calc-macro-item__bar-fill calc-macro-item__bar-fill--${m.key}`}
                              style={{ width: `${m.data.pct}%` }}
                            />
                          </div>
                          <span className="calc-macro-item__kcal">
                            {m.data.kcal} ккал · {m.data.pct}%
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="calc-macro-dist">
                      <div className="calc-macro-dist__bar">
                        <div
                          className="calc-macro-dist__segment calc-macro-dist__segment--protein"
                          style={{ width: `${macroDist.protein.pct}%` }}
                        />
                        <div
                          className="calc-macro-dist__segment calc-macro-dist__segment--fat"
                          style={{ width: `${macroDist.fat.pct}%` }}
                        />
                        <div
                          className="calc-macro-dist__segment calc-macro-dist__segment--carbs"
                          style={{ width: `${macroDist.carbs.pct}%` }}
                        />
                      </div>
                      <div className="calc-macro-dist__legend">
                        <span className="calc-macro-dist__legend-item">
                          <span className="calc-macro-dist__dot calc-macro-dist__dot--protein" />
                          Білки {macroDist.protein.pct}%
                        </span>
                        <span className="calc-macro-dist__legend-item">
                          <span className="calc-macro-dist__dot calc-macro-dist__dot--fat" />
                          Жири {macroDist.fat.pct}%
                        </span>
                        <span className="calc-macro-dist__legend-item">
                          <span className="calc-macro-dist__dot calc-macro-dist__dot--carbs" />
                          Вуглеводи {macroDist.carbs.pct}%
                        </span>
                      </div>
                    </div>

                    <div className="calc-macro-tip">
                      <p className="calc-macro-tip__title">Рекомендація</p>
                      <p className="calc-macro-tip__text">{MACRO_TIPS[macroGoal]}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculators;

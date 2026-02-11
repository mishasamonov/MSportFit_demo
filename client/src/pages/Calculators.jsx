import { useState } from 'react'

const TABS = {
  TDEE: 'tdee',
  BMI: 'bmi',
  MACRO: 'macro',
}

function Calculators() {
  const [activeTab, setActiveTab] = useState(TABS.BMI)

  // TDEE state
  const [sex, setSex] = useState('male')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState('1.55')
  const [tdeeError, setTdeeError] = useState(null)
  const [bmrResult, setBmrResult] = useState(null)
  const [tdeeResult, setTdeeResult] = useState(null)

  // BMI state
  const [bmiHeight, setBmiHeight] = useState('')
  const [bmiWeight, setBmiWeight] = useState('')
  const [bmiError, setBmiError] = useState(null)
  const [bmiResult, setBmiResult] = useState(null)
  const [bmiCategory, setBmiCategory] = useState(null)

  // Macro state
  const [macroWeight, setMacroWeight] = useState('')
  const [macroCalories, setMacroCalories] = useState('')
  const [macroGoal, setMacroGoal] = useState('maintain')
  const [proteinPerKg, setProteinPerKg] = useState('1.8')
  const [fatPerKg, setFatPerKg] = useState('0.8')
  const [macroError, setMacroError] = useState(null)
  const [macroResult, setMacroResult] = useState(null)

  const parsePositive = (value) => {
    const n = Number(value)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  const validateRange = (value, min, max, fieldName) => {
    if (value < min || value > max) {
      return `${fieldName} має бути в діапазоні ${min}–${max}`
    }
    return null
  }

  const handleTdeeCalculate = () => {
    setTdeeError(null)

    const w = parsePositive(weight)
    const h = parsePositive(height)
    const a = parsePositive(age)
    const factor = parsePositive(activity)

    if (!w || !h || !a || !factor) {
      setTdeeError('Усі значення мають бути додатними числами')
      setBmrResult(null)
      setTdeeResult(null)
      return
    }

    // Валідація діапазонів
    const weightErr = validateRange(w, 30, 250, 'Вага')
    const heightErr = validateRange(h, 120, 230, 'Зріст')
    const ageErr = validateRange(a, 10, 90, 'Вік')

    if (weightErr || heightErr || ageErr) {
      setTdeeError(weightErr || heightErr || ageErr)
      setBmrResult(null)
      setTdeeResult(null)
      return
    }

    let bmr =
      10 * w +
      6.25 * h -
      5 * a +
      (sex === 'male' ? 5 : -161)

    const tdee = bmr * factor

    const bmrRounded = Math.round(bmr)
    const tdeeRounded = Math.round(tdee)
    const cutCalories = Math.round(tdee * 0.85) // -15%
    const bulkCalories = Math.round(tdee * 1.10) // +10%

    setBmrResult({
      bmr: bmrRounded,
      tdee: tdeeRounded,
      cut: cutCalories,
      maintain: tdeeRounded,
      bulk: bulkCalories,
    })
    setTdeeResult(tdeeRounded)

    // Підтягнемо калорії у калькулятор макро залежно від обраної мети
    if (!macroWeight) {
      setMacroWeight(String(w))
    }
    updateMacroCaloriesFromGoal(macroGoal, cutCalories, tdeeRounded, bulkCalories)
  }

  const updateMacroCaloriesFromGoal = (goal, cutCal, maintainCal, bulkCal) => {
    const goalCalories = {
      cut: cutCal,
      maintain: maintainCal,
      bulk: bulkCal,
    }
    setMacroCalories(String(goalCalories[goal] || maintainCal))
  }

  const handleBmiCalculate = () => {
    setBmiError(null)

    const w = parsePositive(bmiWeight)
    const h = parsePositive(bmiHeight)

    if (!w || !h) {
      setBmiError('Вага та зріст мають бути додатними числами')
      setBmiResult(null)
      setBmiCategory(null)
      return
    }

    // Валідація діапазонів
    const weightErr = validateRange(w, 30, 250, 'Вага')
    const heightErr = validateRange(h, 120, 230, 'Зріст')

    if (weightErr || heightErr) {
      setBmiError(weightErr || heightErr)
      setBmiResult(null)
      setBmiCategory(null)
      return
    }

    const hMeters = h / 100
    const bmi = w / (hMeters * hMeters)
    const bmiRounded = Math.round(bmi * 10) / 10

    let category = 'Норма'
    if (bmiRounded < 18.5) {
      category = 'Недостатня вага'
    } else if (bmiRounded >= 25 && bmiRounded < 30) {
      category = 'Надлишкова вага'
    } else if (bmiRounded >= 30) {
      category = 'Ожиріння'
    }

    setBmiResult(bmiRounded)
    setBmiCategory(category)
  }

  const handleMacroCalculate = () => {
    setMacroError(null)

    const w = parsePositive(macroWeight)
    const calories = parsePositive(macroCalories)
    const proteinKg = parsePositive(proteinPerKg)
    const fatKg = parsePositive(fatPerKg)

    if (!w || !calories || !proteinKg || !fatKg) {
      setMacroError('Усі значення мають бути додатними числами')
      setMacroResult(null)
      return
    }

    // Валідація діапазонів
    const weightErr = validateRange(w, 30, 250, 'Вага')
    const caloriesErr = validateRange(calories, 800, 6000, 'Калорії')

    if (weightErr || caloriesErr) {
      setMacroError(weightErr || caloriesErr)
      setMacroResult(null)
      return
    }

    const proteinG = w * proteinKg
    const fatG = w * fatKg
    const proteinCal = proteinG * 4
    const fatCal = fatG * 9
    const carbsCal = Math.max(0, calories - proteinCal - fatCal)
    const carbsG = carbsCal / 4

    setMacroResult({
      proteinG: Math.round(proteinG * 10) / 10,
      fatG: Math.round(fatG * 10) / 10,
      carbsG: Math.round(carbsG * 10) / 10,
    })
  }

  // Оновлення макросів при зміні мети
  const handleMacroGoalChange = (goal) => {
    setMacroGoal(goal)

    // Оновлення дефолтних значень макросів
    const macroDefaults = {
      cut: { protein: '2.0', fat: '0.8' },
      maintain: { protein: '1.8', fat: '0.8' },
      bulk: { protein: '1.8', fat: '1.0' },
    }

    const defaults = macroDefaults[goal]
    setProteinPerKg(defaults.protein)
    setFatPerKg(defaults.fat)

    // Якщо TDEE вже розраховано, оновлюємо калорії
    if (bmrResult && typeof bmrResult === 'object') {
      const goalCalories = {
        cut: bmrResult.cut,
        maintain: bmrResult.maintain,
        bulk: bmrResult.bulk,
      }
      setMacroCalories(String(goalCalories[goal] || bmrResult.maintain))
    }
  }

  return (
    <div>
      <h1>Калькулятори</h1>
      <p>Прості розрахунки для контролю ваги, калорій та БЖВ.</p>

      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab(TABS.BMI)}
          disabled={activeTab === TABS.BMI}
        >
          BMI
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TABS.TDEE)}
          disabled={activeTab === TABS.TDEE}
          style={{ marginLeft: '0.5rem' }}
        >
          TDEE / BMR
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(TABS.MACRO)}
          disabled={activeTab === TABS.MACRO}
          style={{ marginLeft: '0.5rem' }}
        >
          Макро
        </button>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px', maxWidth: '400px' }}>
          {activeTab === TABS.BMI && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleBmiCalculate()
              }}
            >
              <h2>BMI — індекс маси тіла</h2>
              <div>
                <label>
                  Зріст (см)
                  <input
                    type="number"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(e.target.value)}
                    min="50"
                  />
                </label>
              </div>
              <div>
                <label>
                  Вага (кг)
                  <input
                    type="number"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(e.target.value)}
                    min="20"
                  />
                </label>
              </div>
              {bmiError && <p style={{ color: 'red' }}>{bmiError}</p>}
              <button type="submit">Розрахувати</button>
            </form>
          )}

          {activeTab === TABS.TDEE && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleTdeeCalculate()
              }}
            >
              <h2>TDEE / добова норма калорій</h2>
              <div>
                <label>
                  Стать
                  <select value={sex} onChange={(e) => setSex(e.target.value)}>
                    <option value="male">Чоловік</option>
                    <option value="female">Жінка</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Вік (років)
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                  />
                </label>
              </div>
              <div>
                <label>
                  Зріст (см)
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="50"
                  />
                </label>
              </div>
              <div>
                <label>
                  Вага (кг)
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="20"
                  />
                </label>
              </div>
              <div>
                <label>
                  Рівень активності
                  <select value={activity} onChange={(e) => setActivity(e.target.value)}>
                    <option value="1.2">Малорухливий (сидячий спосіб життя)</option>
                    <option value="1.375">Легка активність (1-3 рази на тиждень)</option>
                    <option value="1.55">Помірна активність (3-5 днів на тиждень)</option>
                    <option value="1.725">Висока активність (6-7 днів на тиждень)</option>
                    <option value="1.9">Дуже висока (спорт + фізична робота)</option>
                  </select>
                </label>
              </div>
              {tdeeError && <p style={{ color: 'red' }}>{tdeeError}</p>}
              <button type="submit">Розрахувати</button>
            </form>
          )}

          {activeTab === TABS.MACRO && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleMacroCalculate()
              }}
            >
              <h2>Макро — білки, жири, вуглеводи</h2>
              <div>
                <label>
                  Мета
                  <select
                    value={macroGoal}
                    onChange={(e) => handleMacroGoalChange(e.target.value)}
                  >
                    <option value="cut">Схуднення (дефіцит)</option>
                    <option value="maintain">Підтримання ваги</option>
                    <option value="bulk">Набір маси (профіцит)</option>
                  </select>
                </label>
              </div>
              <div>
                <label>
                  Вага (кг)
                  <input
                    type="number"
                    value={macroWeight}
                    onChange={(e) => setMacroWeight(e.target.value)}
                    min="20"
                  />
                </label>
              </div>
              <div>
                <label>
                  Цільові калорії (ккал)
                  <input
                    type="number"
                    value={macroCalories}
                    onChange={(e) => setMacroCalories(e.target.value)}
                    min="500"
                  />
                </label>
              </div>
              <div>
                <label>
                  Білок (г/кг)
                  <input
                    type="number"
                    step="0.1"
                    value={proteinPerKg}
                    onChange={(e) => setProteinPerKg(e.target.value)}
                    min="0.1"
                  />
                </label>
              </div>
              <div>
                <label>
                  Жири (г/кг)
                  <input
                    type="number"
                    step="0.1"
                    value={fatPerKg}
                    onChange={(e) => setFatPerKg(e.target.value)}
                    min="0.1"
                  />
                </label>
              </div>
              {macroError && <p style={{ color: 'red' }}>{macroError}</p>}
              <button type="submit">Розрахувати</button>
            </form>
          )}
        </div>

        <div
          style={{
            flex: '1 1 250px',
            maxWidth: '400px',
            border: '1px solid #ddd',
            padding: '1rem',
            borderRadius: '4px',
          }}
        >
          <h2>Результат</h2>

          {activeTab === TABS.BMI && (
            <>
              {bmiResult == null ? (
                <p>Введіть зріст та вагу, щоб розрахувати BMI.</p>
              ) : (
                <>
                  <p>
                    <strong>Ваш BMI:</strong> {bmiResult}
                  </p>
                  <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Інтерпретація:</strong>
                  </p>
                  <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <div
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: bmiCategory === 'Недостатня вага' ? '#fff3cd' : 'transparent',
                        fontWeight: bmiCategory === 'Недостатня вага' ? 'bold' : 'normal',
                      }}
                    >
                      {'< 18.5 — Недостатня вага'}
                    </div>
                    <div
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: bmiCategory === 'Норма' ? '#d1e7dd' : 'transparent',
                        fontWeight: bmiCategory === 'Норма' ? 'bold' : 'normal',
                      }}
                    >
                      18.5–24.9 — Норма
                    </div>
                    <div
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: bmiCategory === 'Надлишкова вага' ? '#fff3cd' : 'transparent',
                        fontWeight: bmiCategory === 'Надлишкова вага' ? 'bold' : 'normal',
                      }}
                    >
                      25–29.9 — Надлишкова вага
                    </div>
                    <div
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: bmiCategory === 'Ожиріння' ? '#f8d7da' : 'transparent',
                        fontWeight: bmiCategory === 'Ожиріння' ? 'bold' : 'normal',
                      }}
                    >
                      ≥ 30 — Ожиріння
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === TABS.TDEE && (
            <>
              {bmrResult == null ? (
                <p>Заповніть форму та натисніть «Розрахувати», щоб побачити BMR і TDEE.</p>
              ) : (
                <>
                  <p>
                    <strong>BMR (базовий метаболізм):</strong> {bmrResult.bmr} ккал
                  </p>
                  <p>
                    <strong>TDEE (підтримання ваги):</strong> {bmrResult.tdee} ккал
                  </p>
                  <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                  <p style={{ marginBottom: '0.5rem' }}>
                    <strong>Рекомендовані калорії:</strong>
                  </p>
                  <div style={{ paddingLeft: '1rem' }}>
                    <p style={{ margin: '0.25rem 0' }}>
                      • <strong>Схуднення (дефіцит -15%):</strong> {bmrResult.cut} ккал
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      • <strong>Підтримання:</strong> {bmrResult.maintain} ккал
                    </p>
                    <p style={{ margin: '0.25rem 0' }}>
                      • <strong>Набір маси (профіцит +10%):</strong> {bmrResult.bulk} ккал
                    </p>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === TABS.MACRO && (
            <>
              {macroResult == null ? (
                <p>Введіть вагу, калорії та параметри, щоб розрахувати макро.</p>
              ) : (
                <>
                  <p>
                    <strong>Білок:</strong> {macroResult.proteinG} г
                  </p>
                  <p>
                    <strong>Жири:</strong> {macroResult.fatG} г
                  </p>
                  <p>
                    <strong>Вуглеводи:</strong> {macroResult.carbsG} г
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Calculators


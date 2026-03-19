# Product Seed Data Standard

All product nutrition data in `server/scripts/seed.js` follows the rules below.
Any future catalog additions must comply with this standard.

## Rules

1. All nutrition values are stored **per 100 g**.
2. Basic foods use **raw / dry / unprepared** state only.
3. Cooked, boiled, grilled, roasted, or fried values are **never used**.
4. Raw and cooked values are **never mixed** in one dataset.
5. Ukrainian packaged products (dairy, bread) without a good raw/generic
   equivalent use **label-based averages** from 2-3 Ukrainian brands.
6. Product names are **natural Ukrainian names**.

## Source Policy

### USDA FoodData Central (raw generic)

Used for basic, internationally recognized foods where a raw/dry USDA entry exists.

| Product | USDA Entry | FDC ID |
|---|---|---|
| Вівсянка | Cereals, oats, regular and quick, not fortified, dry | #169705 |
| Гречка | Buckwheat groats, roasted, dry | #170685 |
| Куряче філе | Chicken, broilers or fryers, breast, skinless, boneless, meat only, raw | #171077 |
| Індича грудка | Turkey, retail parts, breast, meat only, raw | #174515 |
| Грецький йогурт | Yogurt, Greek, plain, nonfat | #170894 |
| Банан | Bananas, raw | #173944 |
| Яблуко | Apples, raw, with skin | #171688 |
| Брокколі | Broccoli, raw | #11090 |
| Батат | Sweet potato, raw, unprepared | #168482 |
| Мигдаль | Nuts, almonds | #170567 |
| Арахісова паста | Peanut butter, smooth style, without salt | #172470 |

### Ukrainian label averages

Used for local packaged products where USDA has no equivalent.

| Product | Reference brands |
|---|---|
| Сир кисломолочний 5% | Біло 5%, Молочний Візит 5%, Еко-Молоко 5% |

## Ambiguous items — interpretation notes

- **Грецький йогурт**: interpreted as pure generic strained nonfat yogurt (high-protein fitness product), not a local flavoured yogurt. USDA "Yogurt, Greek, plain, nonfat" used. If the intent is a typical Ukrainian 2-3% yogurt, values would differ significantly.
- **Арахісова паста**: interpreted as generic no-added-sugar smooth peanut butter. USDA "without salt" entry used as the most basic/natural variant.
- **Гречка**: USDA "Buckwheat groats, roasted, dry" = 75 g total carbohydrate (includes 10.3 g fiber). This is total carbohydrate, consistent with all other products.

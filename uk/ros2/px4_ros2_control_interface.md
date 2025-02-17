# Інтерфейс керування PX4 ROS 2

<Badge type="warning" text="main (PX4 v1.15)" /> <Badge type="warning" text="Experimental" />

:::warning
Експериментальні налаштування

- Архітектура та основні інтерфейси для визначення режимів ROS 2 є значною мірою стабільними і перевіряються в ІК.
  Бібліотека надає значні переваги в режимі офборду в поточному стані.
- Лише кілька типів значень було врегульовано (інші все ще в розробці).
  Вам можуть знадобитися внутрішні теми PX4, які можуть не залишитись серверно-сумісними з часом.
- API не повністю задокументований.

:::

[PX4 ROS 2 Interface бібліотека](../ros2/px4_ros2_interface_lib.md) - це бібліотека C++++, яка спрощує контроль PX4 з ROS 2.

Розробники використовують бібліотеку для створення і динамічної реєстрації режимів, написаних за допомогою ROS 2.
Ці режими динамічно реєструються в PX4 і здаються частиною PX4 для наземної станції або іншої зовнішньої системи.
Вони навіть можуть замінити стандартні режими в PX4 на покращені версії ROS 2, відновлюючи оригінальну версію, якщо режим ROS2 не вдасться.

Бібліотека також надає класи для надсилання різних типів налаштувань, починаючи від багаторівневих навігаційних завдань на високому рівні аж до прямого контролю приводу.
Ці класи абстрагують внутрішні встановлені точки, які використовуються PX4, і, отже, їх можна використовувати для надання послідовного інтерфейсу ROS 2 для майбутніх версій PX4 і ROS.

## Загальний огляд

Ця діаграма надає концептуального уявлення про те, як режими інтерфейсу і режими керування будуть взаємодіяти з PX4.

![ROS2 modes overview diagram](../../assets/middleware/ros2/px4_ros2_interface_lib/ros2_modes_overview.svg)

<!-- Source: https://docs.google.com/drawings/d/1WByCfgcytnaow7r41VhYJL8OGrw1RjFO51GoPMQBCNA/edit -->

Наступні розділи визначають та пояснюють терміни, що використовуються в діаграмі.

### Означення

#### Режим

Режим визначений за допомогою бібліотеки інтерфейсу має такі властивості:

- Режим - це компонент, який може передавати вказані точки автомобіля для керування рухом (такі як швидкість або прямі вимикачі).
- Режим вибирає тип значень і відправляє його під час активності.
  Він може переключитися між різними типами множин.
- Режим не може активувати інші режими, і він повинен бути активований користувачем (через RC/GCS), контролер польоту в безпечній ситуації _mode executor_, або деяких інших зовнішніх системах.
- Має ім'я, яке відображається у GCS.
- Можна налаштувати вимоги до його режиму (наприклад, що він вимагає достовірної оцінки позиції).
- Режим може виконувати різні завдання, такі як польот до цілі, спуск лебідки, скидання вантажу та повернення назад.
- Режим може замінити режим, визначений у PX4.

#### Виконавець Режимів

Виконавець режимів - це необов'язковий компонент для розкладання режимів.
Наприклад, виконавець режимів для індивідуальної доставки вантажу або режиму обстеження може спочатку ініціювати злет, потім переключитися на індивідуальний режим, і коли він завершиться, ініціювати повернення на базу (RTL).

Зокрема, він має наступні властивості:

- Виконавець режимів - це необов'язковий компонент, який знаходиться на рівень вище за режим.
  Це скінченний автомат, який може активувати режими і чекати їх завершення.
- Це може зробити лише поки він є відповідним.
  Для цього виконавець має лише один власний режим (і режим може належати лише одному виконавцю).
  Цей режим служить для активації виконавця: коли користувач вибирає режим, активується власник-виконавець, який може вибрати будь-який режим.
  Він залишається відповідальним до того моменту, поки користувач не змінить режими (через RC або з GCS), або не спрацює аварійний перехід в інший режим.
  Якщо аварійна ситуація знімається, виконавець знову активується.
- Це дозволяє існувати декільком виконавцям одночасно.
- Виконувачі не можуть активувати інших виконавців.
- У бібліотеці виконавець режимів завжди реалізується в комбінації з індивідуальним режимом.

:::note

- Ці визначення гарантують, що користувач може в будь-який момент забрати контроль від індивідуального режиму або виконавця, командуючи переключення режиму через RC або GCS.
  Виконавець режимів є прозорим для користувача.
- Виконавець режиму є прозорий для користувача.
  Він вибирається і активується опосередковано через власний режим, і тому режим має бути відповідно названий.

:::

#### Перевизначення конфігурації

Обидва режими і виконавці можуть визначати заміну конфігурації, дозволяючи персоналізацію певних поведінок, коли режим або виконавець активний.

Наразі реалізовано наступне:

- _Вимкнення автоматичного роз'єднання_.
  Це дозволяє здійснити посадку та знову злетіти (наприклад, для скидання вантажу).
- _Можливість відкласти неістотні збої помилки_.
  Це дозволяє виконавцю проводити дію без переривання через некритичні заходи безпеки.
  Наприклад, ігнорування заходу безпеки через низький заряд батареї, щоб операція з лебідкою могла бути завершена.

### Порівняння з управлінням з віддаленої платформи

Вищезазначені концепції мають кілька переваг перед традиційним управлінням з віддаленої платформи:

- Декілька вузлів або додатків можуть співіснувати і навіть працювати одночасно.
  Але лише один вузол може керувати транспортним засобом у певний момент, і цей вузол чітко визначений.
- Режими мають відмінну назву і можуть бути відображені / вибрані в GCS.
- Режими інтегровані з аварійною машиною стану та перевірками настроювання.
- Типи установок, які можуть бути відправлені, чітко визначені.
- Режими ROS 2 можуть замінити внутрішні режими контролера польоту (такі як режим повернення).

## Установка та перший тест

Для початку роботи потрібно виконати наступні кроки:

1. Переконайтеся, що у вас є працююче налаштування ROS 2 з px4_msgs у робочому просторі ROS 2.

2. Клонуйте репозиторій в робочий простір:

   ```sh
   ```

   ::::note
   Для забезпечення сумісності, використовуйте останні _main_ гілки для PX4, _px4_msgs_ та бібліотеки.

3. Побудуйте робочий простір:

   ```sh
   ```

4. У іншій оболонці запустіть PX4 SITL:

   ```sh
   ```

   (тут ми використовуємо Gazebo-Classic, але ви можете використовувати будь-яку модель або симулятор)

5. Запустіть агента micro XRCE в новій оболонці (після цього ви можете залишити його запущеним):

   ```sh
   ```

6. Запустіть QGroundControl.

   :::note
   Використовувати QGroundControl Daily, яка підтримує динамічне оновлення списку режимів.

7. Повернутись до терміналу 2 ROS, запустити один із прикладів:

   ```shell
   ```

   Ви повинні отримати на виході режим 'Мій ручний режим' зареєстрований:

   ```sh
   ```

8. На PX4 оболонці ви можете перевірити, що PX4 зареєстрував новий режим:

   ```sh
   ```

   Вихід має містити:

   ```{5}
   ```

9. У цій точці ви також повинні побачити режим в QGroundControl :



10. Виберіть режим, переконайтеся, що у вас є ручне джерело управління (фізичний або віртуальний джойстик), та озброєння транспорту.
    Тоді режим активується, і він має вивести наступний вивід:

    ```sh
    ```

11. Тепер ви готові створити свій власний режим.

## Як користуватися бібліотекою

Наступні розділи описують конкретні функціональні можливості, які надає ця бібліотека.
Крім того, можна підписуватися на будь-яку іншу тему PX4 або публікувати у неї.

### Визначення класу режиму

У цьому розділі розглядається приклад створення класу для власного режиму.

Для повного застосування перегляньте приклади в репозиторії Auterion/px4-ros2-interface-lib, такі як examples/cpp/modes/manual.

```cpp{1,5,7-9,24-31}
```

- `[1]`: Спочатку ми створюємо клас, який успадковується від [`px4_ros2::ModeBase`](https://auterion.github.io/px4-ros2-interface-lib/classpx4__ros2_1_1ModeBase.html).
- `[2]`: У конструкторі ми передаємо назву режиму. Це також дозволяє нам налаштувати деякі інші речі, наприклад, замінити внутрішній режим польоту.
- `[3]`: Саме тут ми створюємо всі об'єкти, через які ми хочемо використовувати пізніше.
  Це може бути RC на виведення, значення типу або телеметрія. `*this` передається як `Контекст` до кожного об'єкту, який асоціює об'єкт з режимом.
- `[4]`: Кожен раз, коли режим активний, цей метод викликається регулярно (частота оновлення залежить від типу вказаної точки).
  Ось де ми можемо працювати і створювати нову установку.

Після створення екземпляру цього режиму потрібно викликати mode->doRegister(), яке фактично реєструється з контролером польоту і повертає false у разі невдачі.
У разі використання виконавця режиму, doRegister() повинно бути викликано на виконавці режиму, а не на самому режимі.

### Визначення класу виконавця режиму

У цьому розділі розглядається приклад створення класу для власного режиму.

```cpp{1,4-5,9-16,20,33-57}
```

- [1]: Спочатку ми створюємо клас, який успадковується від px4_ros2::ModeExecutorBase.
- [2]: Конструктор приймає наш власний режим, який пов'язаний з виконавцем, і передає його в конструктор ModeExecutorBase.
- [3]: Ми визначаємо перерахування для станів, через які ми хочемо пройти.
- [4]: Метод onActivate викликається, коли виконавець стає активним.  На цій точці ми можемо почати проходити через наші стани.
  Як ви це робите - це на ваш розсуд, у цьому прикладі використовується метод runState для виконання наступного стану.
- [5]: При переході до стану ми викликаємо асинхронний метод від ModeExecutorBase для запуску бажаного режиму: run, takeoff, rtl і так далі.
  Ці методи передають функцію, яка викликається при завершенні; зворотний виклик надає аргумент Result, який вказує, чи вдалося виконання чи ні.
  У разі успіху зворотний виклик запускає наступний стан.
- [6]: Ми використовуємо метод scheduleMode(), щоб запустити "власний режим" виконавця, слідуючи тому ж шаблону, що й інші обробники станів.

### Типи установок

Режим може вибрати тип(и) установки, які він хоче використовувати для керування транспортним засобом.
Використані типи також визначають сумісність з різними типами транспортних засобів.

Наступні розділи надають список підтримуваних типів установок:

- GotoSetpointType: Плавне позиціонування та (за бажанням) керування курсом
- DirectActuatorsSetpointType: Пряме керування моторами та установками сервоприводів польотних поверхонь

:::tip
The other setpoint types are currently experimental, and can be found in: [px4\_ros2/control/setpoint\_types/experimental](https://github.com/Auterion/px4-ros2-interface-lib/tree/main/px4_ros2_cpp/include/px4_ros2/control/setpoint_types/experimental).

Ви можете додати свої власні типи установок, додавши клас, який успадковується від px4_ros2::SetpointBase, встановлює прапорці конфігурації відповідно до того, що вимагає установка, а потім публікує будь-яку тему, що містить установку

#### Установка "перейти до" (GotoSetpointType)

:::note
Цей тип установки наразі підтримується лише для багтрикоптерів.
:::

Плавне керування позицією та (за бажанням) керуванням установками курсу за допомогою типу установки px4_ros2::GotoSetpointType.
Тип установки транслюється до плавних позиційних та курсових вирівнювачів на основі FMU, сформульованих з оптимальним за часом, максимальною швидкістю зміни прискорення, з обмеженнями швидкості та прискорення.

Найбільш тривіальне використання полягає в простому введенні 3D-позиції в метод оновлення:

```cpp
```

У цьому випадку заголовок залишиться _uncontrolled_.
Для додаткового контрольного заголовку, вкажіть його в якості другого вхідного аргументу:

```cpp
```

Додатковою особливістю установки цільової точки є динамічний контроль за межами швидкості плавних рухів (тобто максимальні горизонтальні та вертикальні швидкості трансляції, а також швидкість руху по курсу).
Якщо, як вище, не вказано, то плавники за замовчуванням приймуть максимальні значення за замовчуванням транспортного засобу (зазвичай встановлені на фізичні обмеження).
Плавники можуть тільки зменшувати межі швидкості, але ніколи не збільшувати.

```cpp
```

Усі аргументи у методі оновлення, крім позиції, є зразками у вигляді `std::optional<float>`, що означає, що якщо хтось бажає обмежити швидкість руху по курсу, але не швидкості трансляції, це можливо за допомогою `std::nullopt`:

```cpp
```

#### Безпосереднє значення параметра Control (DirectActuatorsSetpointType)

Клапани можна безпосередньо керувати, використовуючи тип встановлення px4_ros2::DirectActuatorsSetpointType.
Мотори і сервоприводи можна встановити незалежно один від одного.
Будьте уважні, що призначення є транспортним засобом та специфікацією.
Наприклад, для управління квадрокоптером потрібно встановити перші 4 мотори відповідно до його конфігурації виводу.

:::note
Якщо ви хочете керувати клапаном, який не контролює рух транспортного засобу, але, наприклад, сервопривід навантаження, подивіться нижче.
:::

### Керування незалежним клапаном/сервоприводом

Якщо ви хочете керувати незалежним клапаном (сервоприводом), дотримуйтесь цих кроків:

1. Налаштуйте вивід
2. Створіть екземпляр px4_ros2::PeripheralActuatorControls у конструкторі вашого режиму.
3. Викличте метод set(), щоб керувати клапаном(-ами).
   Це може бути зроблено незалежно від будь-яких активних встановлень.

### Телеметрія

Ви можете отримати доступ до телеметрії PX4 безпосередньо через наступні класи:

-
-
-

Наприклад, ви можете надати запит на поточну позицію автомобіля наступним чином:

```cpp
```

:::note
Ці теми надають обгортку навколо внутрішніх тем PX4, що дозволяє бібліотеці підтримувати сумісність у випадку зміни внутрішніх тем.
Перевірте px4_ros2/odometry для нових тем, і, звісно, ви можете використовувати будь-яку тему ROS 2, опубліковану з PX4.
:::

### Аварійні вимкнення та вимоги до режимів

Кожен режим має набір прапорців вимог.
Ці прапорці, як правило, автоматично встановлюються в залежності від об'єктів, які використовуються в контексті режиму.
Наприклад, коли додається керування вручну за допомогою коду нижче, прапорець вимог для керування вручну встановлюється:

```cpp
```

Зокрема, встановлення прапорця має наступні наслідки в PX4, якщо умова не виконується:

- Озброєння неможливе, коли вибрано режим
- коли вже озброєний, режим не можна вибрати
- коли озброєний і обраний режим, відповідний аварійний режим спрацьовує (наприклад, втрата RC для вимоги до керування вручну).
  Перевірте [сторінку безпеки](../config/safety.md), щоб налаштувати безпечну поведінку.
  Аварійний режим також спрацьовує, коли режим аварійно завершується або стає несприйнятливим, коли він обраний.

Ось відповідна блок-схема для прапорця керування вручну:



<!-- source: https://drive.google.com/file/d/1g_NlQlw7ROLP_mAi9YY2nDwP0zTNsFlB/view -->

Можна вручну оновити будь-які вимоги до режиму після реєстрації.

```cpp
```



#### Відкладення аварійних режимів

Режим або режим виконавця може тимчасово відкласти неістотні збої, викликаючи метод [`deferFailsafesSync()`](https://auterion.github.io/px4-2-interface-lib/classpx4__ros2_1_1ModeExecutorBase.html#a16ec5be6e70e1d0625bf696c3e29ae).



### Призначення режиму для RC-перемикача або дії джойстика

Зовнішні режими можуть бути призначені на [RC перемикачі](../config/flight_mode.md) або дії джойстика.
При призначенні режиму для RC-перемикача вам потрібно знати індекс (тому що параметри метаданих не містять динамічне ім'я режиму).
Використовуйте статус `commander `, коли режим запущено, щоб отримати цю інформацію.



```plain
```

означає, що ви б обрали **Зовнішній режим 1** в QGC:



:::note
PX4 забезпечує, що певний режим завжди призначається тому ж індексу, зберігаючи хеш назви режиму.
This makes it independent of startup ordering in case of multiple external modes.
:::

### Заміна внутрішнього режиму

Зовнішній режим може замінити існуючий внутрішній режим, наприклад, режим Повернення (RTL).
При цьому кожного разу, коли вибирається RTL (через користувача або ситуацію аварійного виклику), замість внутрішнього режиму використовується зовнішній. Внутрішній режим використовується лише як резервний випадок.
Внутрішній режим використовується лише як резервний випадок, коли зовнішній стає недоступним або відмовляє.

Замінений режим можна встановити в налаштуваннях конструктора ModeBase:

```cpp
```

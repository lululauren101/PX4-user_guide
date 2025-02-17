# Телеметричні радіо/модеми

Бездротові телеметричні радіо можуть (за потреби) використовуватися для забезпечення бездротового підключення MAVLink між станцією земного контролю, такою як _QGroundControl_, та транспортним засобом, що працює на PX4. Це дозволяє налаштовувати параметри під час польоту, перевіряти телеметрію в реальному часі, змінювати місію на льоту тощо.

PX4 підтримує ряд типів телеметрійних радіозон:

- Прошивка на базі радіо [SiK](../telemetry/sik_radio.md) (загалом, будь-яке радіо з інтерфейсом UART повинно працювати).
  - [RFD900 Telemetry Radio](../telemetry/rfd900_telemetry.md)
  - [HolyBro SiK Telemetry Radio](../telemetry/holybro_sik_radio.md)
  - <del>_HKPilot Telemetry Radio_</del> (Discontinued)
  - <del>_3DR Telemetry Radio_</del> (Discontinued)
- [Telemetry Wifi](../telemetry/telemetry_wifi.md)
- [Microhard Serial Telemetry Radio](../telemetry/microhard_serial.md)
  - [ARK Electron Microhard Serial Telemetry Radio](../telemetry/ark_microhard_serial.md)
  - [Holybro Microhard P900 Telemetry Radio](../telemetry/holybro_microhard_p900_radio.md)
- CUAV Serial Telemetry Radio
  - [CUAV P8 Telemetry Radio](../telemetry/cuav_p8_radio.md)
- XBee Serial Telemetry Radio
  - [HolyBro XBP9X Telemetry Radio](../telemetry/holybro_xbp9x_radio.md) (Discontinued)

PX4 є протоколом, сумісним із [SiK Radio](../telemetry/sik_radio.md), і, як правило, працюватиме з коробки (хоча вам може знадобитися змінити/використати відповідний роз’єм).

Телеметрія по WiFi зазвичай має менший радіус дії, вищі швидкості передачі даних і спрощує підтримку FPV/відеопотоків. One benefit of WiFi radios is that you only need to purchase a single radio unit for your vehicle (assuming the ground station already has WiFi).

:::note PX4 не підтримує підключення LTE USB-модуля до контролера польоту (і передачу трафіку MAVLink через Інтернет). Однак ви можете підключити модуль LTE до компаньйонного комп'ютера і використовувати його для маршрутизації трафіку MAVLink від контролера польоту. Для отримання додаткової інформації дивіться: [Периферійні пристрої компаньйонного комп'ютера > Дані телефонії](../companion_computer/companion_computer_peripherals.md#data-telephony-lte).
:::

## Дозволені частоти

Діапазони радіочастот, дозволені для використання з дронами, відрізняються між континентами, регіонами, країнами, а навіть штатами. Вам слід вибрати телеметричне радіо, яке використовує діапазон частот, дозволений у тих областях, де ви плануєте використовувати дрона.

Радіо низької потужності [SiK](../telemetry/sik_radio.md), такі як [Holybro Telemetry Radio](../telemetry/holybro_sik_radio.md), часто доступні у варіантах 915 МГц та 433 МГц. Хоча вам слід перевірити діючі закони у своїй країні/штаті, загалом кажучи, 915 МГц можна використовувати у США, тоді як 433 МГц можна використовувати в ЄС, Африці, Океанії та більшості Азії.

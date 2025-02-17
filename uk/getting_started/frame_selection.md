# Вибір рухомого засобу

P4X підтримує повітряні, наземні та підводні рухомі засоби. Повний перелік типів рухомих засобів та їх варіантів ("шасі") які були протестовані / налаштовані для використання з PX4 ви можете знайти тут: [Довідник планерів](../airframes/airframe_reference.md).

Обирайте шасі в залежності від ваших потреб:
- **Мультикоптери** надають точність зависання та вертикальний зліт коштом коротшого та, як правило, повільнішого польоту. У PX4 є режими, які полегшують польоти й вони є найпопулярнішим видом літального засобу.
- **Гелікоптери** подібні до мультикоптерів, механічно складніші, але ефективніші.
- Літаки або літальні апарати з **фіксованим крилом** надають довший та швидший політ, а отже краще покриття для обстеження поверхні землі й т. ін. Однак літати та приземлятися ними важче ніж мультикоптерами, а також вони не придатні до зависання або дуже повільного польоту (тобто для обстеження вертикальних структур).
- **VTOL** (апарати вертикального зльоту та посадки) зустрічаються чисельних типів: тілтротори, тейлсітери, квадроплани й т. ін. Вони пропонують найкраще з обох опцій: зліт у вертикальному режимі як мультикоптер та наступний перехід в горизонтальний політ як літак. Вони часто дорожчі за мультикоптери або апарати літакового типу, а також їх важче збирати та налаштовувати.
- **Дирижаблі/Повітряні кулі** це повітряні засоби легші за повітря, які зазвичай надають довгу тривалість польоту на значній висоті, часто коштом обмеженої (або відсутньої) здатності керувати швидкістю та напрямком польоту.
- **Ровери** - подібні до автомобіля наземні транспортні засоби. Вони прості в керуванні та часто приємні у використанні.
- **Човни** - надводні рухомі засоби.
- **Підводні апарати** - підводні рухомі засоби.

:::note
Налаштування планеру, що використовуються PX4, здійснюється в *QGroundControl* під час початкового налаштування: [Налаштування планера](../config/airframe.md).

![Вибір шасі](../../assets/qgc/setup/airframe/airframe_px4.jpg) :::

# 수동/안정화 모드 (멀티콥터)

<img src="../../assets/site/difficulty_medium.png" title="중급 난이도 비행" width="30px" />&nbsp;<img src="../../assets/site/remote_control.svg" title="수동/원격 제어 필요" width="30px" />&nbsp;

The _Manual/Stabilized_ mode stabilizes the multicopter when the RC control sticks are centred. 기체를 수동으로 움직이거나 조종하려면 스틱을 중앙의 바깥쪽으로 제어합니다.

:::note
This multicopter mode is enabled if you set either _Manual_ or _Stabilized_ modes.
:::

When under manual control the roll and pitch sticks control the _angle_ of the vehicle (attitude) around the respective axes, the yaw stick controls the rate of rotation above the horizontal plane, and the throttle controls altitude/speed.

조종 스틱을 놓으면 중앙 데드 존으로 돌아갑니다. 롤 포크와 피치 스틱이 중앙에 오면 멀티 피터가 수평을 유지하고 정지합니다. 기체는 적절하게 균형을 잡고, 스로틀이 적절하게 설정되고([아래](#params) 참고), 외력이 가해지지 않으면 (예 : 바람), 고도에 유지되거나 유지됩니다. 기체는는 바람 방향으로 표류하게 되며, 고도를 유지하기 위해서는 스로틀을 제어하여야 합니다.

![MC Manual Flight](../../assets/flight_modes/stabilized_mc.png)

## 기술적 설명

RC mode where centered sticks level vehicle (only - position is not stabilized).

조종사의 입력은 롤 및 피치 각 명령과 요 율 명령으로 전달됩니다. Throttle is rescaled (see [below](#params)) and passed directly to control allocation. 자동 조종 장치는 자세를 제어합니다. 즉, RC 스틱이 컨트롤러 데드 존 내부에 집중 될 때 롤과 피치 각을 제로로 조절합니다 (결과적으로 태도가 수평이 됨). 자동 조종 장치는 바람 (또는 다른 원인)으로 인한 드리프트를 보상하지 않습니다.

- Centered sticks (inside deadband):
  - Roll/Pitch sticks level vehicle.
- Outside center:
  - Roll/Pitch sticks control tilt angle in those orientations, resulting in corresponding left-right and forward-back movement.
  - Throttle stick controls up/down speed (and movement speed in other axes).
  - Yaw stick controls rate of angular rotation above the horizontal plane.
- Manual control input is required (such as RC control, joystick).
  - Roll, Pitch: Assistance from autopilot to stabilize the attitude. Position of RC stick maps to the orientation of vehicle.
  - Throttle: Manual control via RC sticks. RC input is sent directly to control allocation.
  - Yaw: Assistance from autopilot to stabilize the attitude rate. Position of RC stick maps to the rate of rotation of vehicle in that orientation.

<a id="params"></a>

## 매개 변수

| 매개 변수                                                                                               | 설명                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="MPC_THR_HOVER"></a>[MPC_THR_HOVER](../advanced_config/parameter_reference.md#MPC_THR_HOVER) | 스로틀 스틱이 중앙에 있고 `MPC_THR_CURVE`가 기본값으로 설정되어있을 때 출력되는 호버 스로틀입니다.                                                                                                                                                                                                                                                                                                    |
| <a id="MPC_THR_CURVE"></a>[MPC_THR_CURVE](../advanced_config/parameter_reference.md#MPC_THR_CURVE) | 스로틀 스케일링을 정의합니다. 기본적으로이 값은 **호버 추력으로 조정**으로 설정되어 있습니다. 즉, 스로틀 스틱이 중앙에있을 때 구성된 호버 스로틀이 출력되고 (`MPC_THR_HOVER`) 스틱 입력이 선형으로 조정됩니다. <br>강력한 기체의 경우 호버 스로틀이 매우 낮아 (예 : 20 % 미만) 스로틀 입력이 왜곡 될 수 있습니다. 즉, 여기서 추력의 80 %는 스틱 입력의 상단 절반으로, 하단은 20 %로 제어됩니다. 필요한 경우 `MPC_THR_CURVE`를 **No Rescale**로 설정하여 배율을 다시 조정할 수 없습니다 (스로틀 매핑에 대한 스틱 입력은 `MPC_THR_HOVER`과 무관 함). |

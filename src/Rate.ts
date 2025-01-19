import { Field, SmartContract, state, State, method } from 'o1js';

export class Rate extends SmartContract {
  @state(Field) rate = State<Field>();
  @state(Field) participantNum = State<Field>();

  init() {
    super.init();
    this.rate.set(Field(0));
    this.participantNum.set(Field(0));
  }

  @method async update(newRate: Field) {
    const currentRate = this.rate.get();
    this.rate.requireEquals(currentRate);
    const currentParticipantNum = this.participantNum.get();
    this.participantNum.requireEquals(currentParticipantNum);

    const updatdedParticipantNum = currentParticipantNum.add(1);
    const updatedRate = currentRate
      .mul(currentParticipantNum)
      .add(newRate)
      .div(updatdedParticipantNum);

    this.participantNum.set(updatdedParticipantNum);
    this.rate.set(updatedRate);
  }
}

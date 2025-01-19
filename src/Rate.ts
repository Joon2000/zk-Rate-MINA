import { Field, UInt8, SmartContract, state, State, method } from 'o1js';

export class Rate extends SmartContract {
  @state(UInt8) rate = State<UInt8>();
  @state(UInt8) rateMod = State<UInt8>();
  @state(UInt8) participantNum = State<UInt8>();

  init() {
    super.init();
    this.rate.set(UInt8.from(0));
    this.rateMod.set(UInt8.from(0));
    this.participantNum.set(UInt8.from(0));
  }

  @method async update(newRate: UInt8) {
    const currentRate = this.rate.get();
    this.rate.requireEquals(currentRate);
    const currentRateMod = this.rateMod.get();
    this.rateMod.requireEquals(currentRateMod);
    const currentParticipantNum = this.participantNum.get();
    this.participantNum.requireEquals(currentParticipantNum);

    const updatdedParticipantNum = currentParticipantNum.add(1);
    const { quotient: updatedRate, remainder: updatedRateMod } = currentRate
      .mul(currentParticipantNum)
      .add(newRate)
      .add(currentRateMod)
      .divMod(updatdedParticipantNum);

    this.participantNum.set(updatdedParticipantNum);
    this.rate.set(updatedRate);
    this.rateMod.set(updatedRateMod);
  }
}

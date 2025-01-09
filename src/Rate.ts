import { Field, SmartContract, state, State, method } from 'o1js';

export class Rate extends SmartContract {
  @state(Field) rate = State<Field>();
  @state(Field) participantNum = State<Field>();

  init() {
    super.init();
    this.rate.set(Field(0));
  }
}

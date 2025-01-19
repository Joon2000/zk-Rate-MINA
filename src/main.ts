import { mod } from 'o1js/dist/node/bindings/crypto/finite-field.js';
import { Rate } from './Rate.js';
import { UInt8, Mina, PrivateKey, AccountUpdate } from 'o1js';

const useProof = false;

const Local = await Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0];
const deployerKey = deployerAccount.key;
const senderAccount = Local.testAccounts[1];
const senderKey = senderAccount.key;
// ----------------------------------------------------

// Create a public/private key pair. The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

// create an instance of Square - and deploy it to zkAppAddress
const zkAppInstance = new Rate(zkAppAddress);
const deployTxn = await Mina.transaction(deployerAccount, async () => {
  // 1 Mina fee is required to create a new account for the zkApp
  // This line means the deployer account will pay the fee for any account created in this transaction
  AccountUpdate.fundNewAccount(deployerAccount);
  await zkAppInstance.deploy();
});
await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();

// get the initial state of Square after deployment
const rate0 = zkAppInstance.rate.get();
const mod0 = zkAppInstance.rateMod.get();
const particpiantNumb0 = zkAppInstance.participantNum.get();
console.log(
  'state after init:',
  'rate: ',
  rate0.toString(),
  ', mod: ',
  mod0.toString(),
  ', participiant numb: ',
  particpiantNumb0.toString()
);

// ----------------------------------------------------

const txn1 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.update(new UInt8(5));
});
await txn1.prove();
await txn1.sign([senderKey]).send();

const rate1 = zkAppInstance.rate.get();
const mod1 = zkAppInstance.rateMod.get();
const participantNumb1 = zkAppInstance.participantNum.get();
console.log(
  'state after init:',
  'rate: ',
  rate1.toString(),
  ', mod: ',
  mod1.toString(),
  ', participiant numb: ',
  participantNumb1.toString()
);

// ----------------------------------------------------

try {
  const txn2 = await Mina.transaction(senderAccount, async () => {
    await zkAppInstance.update(new UInt8(10));
  });
  await txn2.prove();
  await txn2.sign([senderKey]).send();
} catch (error: any) {
  console.log(error.message);
}
const rate2 = zkAppInstance.rate.get();
const mod2 = zkAppInstance.rateMod.get();
const participantNumb2 = zkAppInstance.participantNum.get();
console.log(
  'state after init:',
  'rate: ',
  rate2.toString(),
  ', mod: ',
  mod2.toString(),
  ', participiant numb: ',
  participantNumb2.toString()
);

// ----------------------------------------------------

const txn3 = await Mina.transaction(senderAccount, async () => {
  await zkAppInstance.update(new UInt8(0));
});
await txn3.prove();
await txn3.sign([senderKey]).send();

const rate3 = zkAppInstance.rate.get();
const mod3 = zkAppInstance.rateMod.get();
const participantNumb3 = zkAppInstance.participantNum.get();
console.log(
  'state after init:',
  'rate: ',
  rate3.toString(),
  ', mod: ',
  mod3.toString(),
  ', participiant numb: ',
  participantNumb3.toString()
);

// ----------------------------------------------------

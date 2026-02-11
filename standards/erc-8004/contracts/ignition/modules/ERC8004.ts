import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ERC8004Module = buildModule("ERC8004Module", (m) => {
  // Deploy IdentityRegistry first
  const identityRegistry = m.contract("IdentityRegistry");

  // Deploy ReputationRegistry with IdentityRegistry address
  const reputationRegistry = m.contract("ReputationRegistry", [identityRegistry]);

  // Deploy ValidationRegistry with IdentityRegistry address
  const validationRegistry = m.contract("ValidationRegistry", [identityRegistry]);

  return {
    identityRegistry,
    reputationRegistry,
    validationRegistry
  };
});

export default ERC8004Module;

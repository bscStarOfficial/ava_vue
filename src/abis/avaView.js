export default [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "x",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "y",
        "type": "uint256"
      }
    ],
    "name": "PRBMath_MulDiv18_Overflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "uint32",
            "name": "id",
            "type": "uint32"
          },
          {
            "internalType": "uint40",
            "name": "stakeTime",
            "type": "uint40"
          },
          {
            "internalType": "uint128",
            "name": "amount",
            "type": "uint128"
          },
          {
            "internalType": "bool",
            "name": "status",
            "type": "bool"
          },
          {
            "internalType": "uint8",
            "name": "stakeIndex",
            "type": "uint8"
          },
          {
            "internalType": "uint40",
            "name": "unStakeTime",
            "type": "uint40"
          }
        ],
        "internalType": "struct AvaView.Record",
        "name": "record",
        "type": "tuple"
      }
    ],
    "name": "caclItem",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "rates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const boxerFights = [
  {
    A: "d5400d29-df53-410c-8bfc-f8f5552ab971",
    B: "b0eca222-249e-4da0-934f-2495a9613b62",
  },
  {
    A: "0c939743-8781-449e-885e-30e842dec330",
    B: "b0eca222-249e-4da0-934f-2495a9613b62",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "24fa4e03-ce2f-4526-9ca1-4156268cb036",
  },
  {
    A: "59670ffd-2fbe-4586-83ea-55b6843d3295",
    B: "24fa4e03-ce2f-4526-9ca1-4156268cb036",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "6167c8c2-4aba-4316-b181-dcaed618f319",
  },
  {
    A: "4ecd3d72-d152-47cc-bb75-9251a4fcaec3",
    B: "6167c8c2-4aba-4316-b181-dcaed618f319",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "0c09b650-b721-47a4-ba7a-ea912e049f04",
  },
  {
    A: "c11fe62e-c258-4027-bbad-ba214c00f9a5",
    B: "0c09b650-b721-47a4-ba7a-ea912e049f04",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "db1d9336-b362-43fb-af1c-5d11dd705da6",
  },
  {
    A: "0384a377-cfe2-47bb-9429-001c537eea6d",
    B: "db1d9336-b362-43fb-af1c-5d11dd705da6",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "126cdf87-6b8c-4014-8ece-df36b8cacba8",
  },
  {
    A: "a96d9d61-f0a3-4094-a628-a9dc86f9e701",
    B: "126cdf87-6b8c-4014-8ece-df36b8cacba8",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "6fa05ed7-48b5-41b3-a804-ed93bae880e8",
  },
  {
    A: "3234cce3-0cbe-4339-b57a-84f008cdbf2a",
    B: "6fa05ed7-48b5-41b3-a804-ed93bae880e8",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "8adcc96d-440a-4504-9d19-e0ee83662c7b",
  },
  {
    A: "972c2bac-6ded-4df2-938b-2ce355e8b11c",
    B: "8adcc96d-440a-4504-9d19-e0ee83662c7b",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "14f98494-e0ec-4136-b712-c076e829e33a",
  },
  {
    A: "42ba0111-38b5-45fe-8f8f-812d65b175b1",
    B: "14f98494-e0ec-4136-b712-c076e829e33a",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "802c95c0-ff9b-4963-af62-df5499bd2fdf",
  },
  {
    A: "de148f95-37e1-4eaa-968e-2f7569ec4111",
    B: "802c95c0-ff9b-4963-af62-df5499bd2fdf",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "f958c6a6-b335-49c6-a356-a814e3a97aa5",
  },
  {
    A: "3124d286-0602-4b68-8923-b26a3463d4a8",
    B: "f958c6a6-b335-49c6-a356-a814e3a97aa5",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "10ea2edd-8f14-45f3-bd66-649ccb8744cd",
  },
  {
    A: "76fa2a4b-2c5a-42ca-ad39-d2e9605ea795",
    B: "10ea2edd-8f14-45f3-bd66-649ccb8744cd",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "b520c3ad-d169-40d7-81ad-9df1e5dd1d2e",
  },
  {
    A: "10800417-571e-4565-b8db-53c80e2a0ff2",
    B: "b520c3ad-d169-40d7-81ad-9df1e5dd1d2e",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "a4116865-3ab6-41be-877c-c8bfe1bdcc8f",
  },
  {
    A: "94d25952-9af5-4055-87cc-d8a7ca29ecb7",
    B: "a4116865-3ab6-41be-877c-c8bfe1bdcc8f",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "b15dd875-14cc-4848-8cd8-aa2b8b4c9b31",
  },
  {
    A: "861c3a4c-0ed0-4279-8470-9a0fa3060ff3",
    B: "b15dd875-14cc-4848-8cd8-aa2b8b4c9b31",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "86caf90a-6de6-454f-901a-16898c969a6a",
  },
  {
    A: "3b64f05a-5793-4f31-8932-2fc98f612860",
    B: "86caf90a-6de6-454f-901a-16898c969a6a",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "f23662bb-c6a8-467a-b484-f22238a5883e",
  },
  {
    A: "275804e9-9a39-42e0-b2de-ebe7909e2e26",
    B: "f23662bb-c6a8-467a-b484-f22238a5883e",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "a8a8386e-3ebb-4354-a080-ecf2e6315004",
  },
  {
    A: "6a88e44e-dbc1-4e01-970e-8992cbea4405",
    B: "a8a8386e-3ebb-4354-a080-ecf2e6315004",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "345dd357-0dc4-4ff4-9431-95f4778f1252",
  },
  {
    A: "3a5f26a5-d460-4c70-94e0-c2be807e9169",
    B: "345dd357-0dc4-4ff4-9431-95f4778f1252",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "603734ab-e4df-4164-820d-f7277f5950e1",
  },
  {
    A: "76fa2a4b-2c5a-42ca-ad39-d2e9605ea795",
    B: "603734ab-e4df-4164-820d-f7277f5950e1",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "73f2fbc5-9a0d-4f9b-acd1-e24f7cfc0c46",
  },
  {
    A: "0ef5c373-3f53-41d6-8b5b-edab2da86407",
    B: "73f2fbc5-9a0d-4f9b-acd1-e24f7cfc0c46",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "65710d98-c4e7-47c8-a1fd-c3764a5f36b6",
  },
  {
    A: "10800417-571e-4565-b8db-53c80e2a0ff2",
    B: "65710d98-c4e7-47c8-a1fd-c3764a5f36b6",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "ba136d01-1bf2-432f-af60-90cae174da05",
  },
  {
    A: "b64083e4-e29a-412a-8ef5-3010cfca3f6f",
    B: "ba136d01-1bf2-432f-af60-90cae174da05",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "2fa09e1e-6541-47b7-a80d-5049517f5131",
  },
  {
    A: "a17b3f28-af83-4e4f-9b40-961121b9b802",
    B: "2fa09e1e-6541-47b7-a80d-5049517f5131",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "edb5d3b5-d419-465a-87b5-2b2faffaf951",
  },
  {
    A: "a17b3f28-af83-4e4f-9b40-961121b9b802",
    B: "edb5d3b5-d419-465a-87b5-2b2faffaf951",
  },
  {
    A: "238e109f-9de3-4e9c-8057-a3f28cb36518",
    B: "615c6a6f-cec4-46cc-9506-611d3e1a38c7",
  },
  {
    A: "41d13543-b419-4b40-aa7b-890529d468c1",
    B: "615c6a6f-cec4-46cc-9506-611d3e1a38c7",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "63e64213-9e0f-459c-9979-5f78534c8fe2",
  },
  {
    A: "e7481413-4b21-4d4c-a0bd-2efa3e96e229",
    B: "63e64213-9e0f-459c-9979-5f78534c8fe2",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "6094545b-b517-49a9-94b0-0e8b07619752",
  },
  {
    A: "c3200a0a-395d-459d-bfdd-5183cda6dc24",
    B: "6094545b-b517-49a9-94b0-0e8b07619752",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "22e7a64e-4196-428c-a30b-c1aa1aa0addc",
  },
  {
    A: "f745246d-c749-445c-98cb-38b8a70912fd",
    B: "22e7a64e-4196-428c-a30b-c1aa1aa0addc",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "1fd7c505-7167-4d25-a061-e6e5e57db901",
  },
  {
    A: "29872b11-5975-4748-b929-9afa4b2504b1",
    B: "1fd7c505-7167-4d25-a061-e6e5e57db901",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "e1fd74e5-7f47-488d-8b21-e4ec2d22e6bc",
  },
  {
    A: "e0bda747-7ab2-4e1e-b110-bbd9afc27df3",
    B: "e1fd74e5-7f47-488d-8b21-e4ec2d22e6bc",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "71e52b2b-4ce0-4644-9408-39867b165193",
  },
  {
    A: "efac72f9-b9ef-4d46-ab58-ed24fceb10e0",
    B: "71e52b2b-4ce0-4644-9408-39867b165193",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "a03b6ec6-4880-42c8-a698-ee9129ca089c",
  },
  {
    A: "c1abbefe-9730-4451-9372-d2d888dbc4a4",
    B: "a03b6ec6-4880-42c8-a698-ee9129ca089c",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "9130b369-0717-4624-99de-417540b8dcfe",
  },
  {
    A: "8bb0346a-8102-4039-923c-984a8c31d96c",
    B: "9130b369-0717-4624-99de-417540b8dcfe",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "64a660d2-fe9f-4a7d-82ae-e10e3c82f30f",
  },
  {
    A: "d0b94cc3-b597-48be-a6fd-93b4dbe16bbc",
    B: "64a660d2-fe9f-4a7d-82ae-e10e3c82f30f",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "3429876e-84ee-4ae9-876e-e42a08b77f61",
  },
  {
    A: "f9832570-a6dc-42ae-878d-e961659904f6",
    B: "3429876e-84ee-4ae9-876e-e42a08b77f61",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "0685ff7f-ee50-4ade-a818-e3f0f9e5d923",
  },
  {
    A: "8bb0346a-8102-4039-923c-984a8c31d96c",
    B: "0685ff7f-ee50-4ade-a818-e3f0f9e5d923",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "a85c6625-99e0-4b3e-a459-2fec2089b5be",
  },
  {
    A: "c1abbefe-9730-4451-9372-d2d888dbc4a4",
    B: "a85c6625-99e0-4b3e-a459-2fec2089b5be",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "0ba8035a-8fe5-4c6a-b680-a9e12eeaab72",
  },
  {
    A: "c1abbefe-9730-4451-9372-d2d888dbc4a4",
    B: "0ba8035a-8fe5-4c6a-b680-a9e12eeaab72",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "4126e8cb-00b1-4a4b-8e6b-47f950cc091b",
  },
  {
    A: "877eabde-f9c0-48c2-893b-dab8963a62d1",
    B: "4126e8cb-00b1-4a4b-8e6b-47f950cc091b",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "bc707474-5aba-4544-9286-0a41956a1107",
  },
  {
    A: "075ff97a-d9e5-4492-9677-24f4c061a0a3",
    B: "bc707474-5aba-4544-9286-0a41956a1107",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "22825bf6-3912-46a2-9254-8354cd9abab7",
  },
  {
    A: "c1abbefe-9730-4451-9372-d2d888dbc4a4",
    B: "22825bf6-3912-46a2-9254-8354cd9abab7",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "52665559-f8ce-4fe0-89db-1dcdf405b575",
  },
  {
    A: "61759f2c-02cf-42d6-9cd8-de7f07e16d88",
    B: "52665559-f8ce-4fe0-89db-1dcdf405b575",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "7803029f-e45a-402e-9ade-3ea9b242b64d",
  },
  {
    A: "6e845fb1-26f0-4c71-a831-934ae1095da4",
    B: "7803029f-e45a-402e-9ade-3ea9b242b64d",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "487410c0-4f80-44ec-8493-f92a9494e112",
  },
  {
    A: "877eabde-f9c0-48c2-893b-dab8963a62d1",
    B: "487410c0-4f80-44ec-8493-f92a9494e112",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "abbee748-cbad-4617-ba94-eb2558ad3b36",
  },
  {
    A: "877eabde-f9c0-48c2-893b-dab8963a62d1",
    B: "abbee748-cbad-4617-ba94-eb2558ad3b36",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "a1b49fb2-4d86-49da-8a6d-256cbfecac9a",
  },
  {
    A: "877eabde-f9c0-48c2-893b-dab8963a62d1",
    B: "a1b49fb2-4d86-49da-8a6d-256cbfecac9a",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "4ceb0317-33d4-4838-8b5c-4cbfb89baa63",
  },
  {
    A: "5165d199-d131-48e5-bfb9-ac1e0a01d741",
    B: "4ceb0317-33d4-4838-8b5c-4cbfb89baa63",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "84ca3d84-6bd7-4714-b291-217b6cf545d0",
  },
  {
    A: "f44ce5ce-c8c5-4192-8c63-30d653f2f983",
    B: "84ca3d84-6bd7-4714-b291-217b6cf545d0",
  },
  {
    A: "ddea6188-b078-4b96-811b-7a8740fc77c0",
    B: "322fb65f-2353-4203-b8fc-ae6611cfe0fd",
  },
  {
    A: "735b4383-e0ae-4ec0-b647-eff9cadca044",
    B: "322fb65f-2353-4203-b8fc-ae6611cfe0fd",
  },
];

async function debug() {
  for (boxerFight of boxerFights) {
    const fight = await prisma.fight.findUnique({
      where: {
        id: boxerFight.B,
      },
    });
    //console.log(fight);
    if (fight === null) {
      const boxer = await prisma.boxer.findUnique({
        where: {
          id: boxerFight.A,
        },
      });
      console.log(boxer);
    }
  }
}

debug();

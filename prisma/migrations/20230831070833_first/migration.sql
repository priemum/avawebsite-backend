-- CreateTable
CREATE TABLE "Team" (
    "ID" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Users" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "DOB" TIMESTAMP(3) NOT NULL,
    "Email" TEXT NOT NULL,
    "PhoneNo" TEXT NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "Gender" TEXT NOT NULL,
    "teamID" TEXT NOT NULL,
    "roleID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Role" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Resources" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Role_Resources" (
    "ID" TEXT NOT NULL,
    "Create" BOOLEAN NOT NULL,
    "Read" BOOLEAN NOT NULL,
    "Update" BOOLEAN NOT NULL,
    "Delete" BOOLEAN NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "roleID" TEXT NOT NULL,
    "resourcesID" TEXT NOT NULL,

    CONSTRAINT "Role_Resources_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Articles" (
    "ID" TEXT NOT NULL,
    "MinRead" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "usersID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Images" (
    "ID" TEXT NOT NULL,
    "URL" TEXT NOT NULL,
    "Alt" TEXT NOT NULL,
    "Width" INTEGER NOT NULL,
    "Height" INTEGER NOT NULL,
    "Size" DOUBLE PRECISION NOT NULL,
    "Type" TEXT NOT NULL,
    "usersID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Address" (
    "ID" TEXT NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "addressID" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Unit" (
    "ID" TEXT NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Currency" (
    "ID" TEXT NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Languages" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Articles_Translation" (
    "ID" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Caption" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Articles_Translation_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Address_Translation" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "addressID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_Translation_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Unit_Translation" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "unitID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_Translation_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "Currency_Translation" (
    "ID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "currencyID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_Translation_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Images_usersID_key" ON "Images"("usersID");

-- CreateIndex
CREATE UNIQUE INDEX "Address_addressID_key" ON "Address"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "Languages_Name_key" ON "Languages"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Languages_Code_key" ON "Languages"("Code");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_resourcesID_fkey" FOREIGN KEY ("resourcesID") REFERENCES "Resources"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles_Translation" ADD CONSTRAINT "Articles_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_currencyID_fkey" FOREIGN KEY ("currencyID") REFERENCES "Currency"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

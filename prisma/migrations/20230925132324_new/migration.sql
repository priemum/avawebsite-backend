-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "DOB" TIMESTAMP(3),
    "Email" TEXT NOT NULL,
    "PhoneNo" TEXT,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "Gender" "Gender",
    "Password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "teamID" TEXT,
    "roleID" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "Name" TEXT,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resources" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role_Resources" (
    "id" TEXT NOT NULL,
    "Create" BOOLEAN NOT NULL,
    "Read" BOOLEAN NOT NULL,
    "Update" BOOLEAN NOT NULL,
    "Delete" BOOLEAN NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "roleID" TEXT NOT NULL,
    "resourcesID" TEXT NOT NULL,

    CONSTRAINT "Role_Resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles" (
    "id" TEXT NOT NULL,
    "MinRead" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "usersID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "imagesId" TEXT,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "URL" TEXT NOT NULL,
    "Alt" TEXT NOT NULL,
    "Width" INTEGER,
    "Height" INTEGER,
    "Size" DOUBLE PRECISION,
    "Type" TEXT,
    "usersID" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "teamID" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "Longitude" DOUBLE PRECISION NOT NULL,
    "Latitude" DOUBLE PRECISION NOT NULL,
    "addressID" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "imagesId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "conversionRate" INTEGER NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Languages" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Code" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articles_Translation" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Caption" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "articlesId" TEXT NOT NULL,

    CONSTRAINT "Articles_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address_Translation" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "addressID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit_Translation" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "unitID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Currency_Translation" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "languagesID" TEXT NOT NULL,
    "currencyID" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Currency_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_Title_key" ON "Team"("Title");

-- CreateIndex
CREATE UNIQUE INDEX "Users_Email_key" ON "Users"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Name_key" ON "Role"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Resources_Name_key" ON "Resources"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_Resources_roleID_resourcesID_key" ON "Role_Resources"("roleID", "resourcesID");

-- CreateIndex
CREATE UNIQUE INDEX "Images_usersID_key" ON "Images"("usersID");

-- CreateIndex
CREATE UNIQUE INDEX "Images_teamID_key" ON "Images"("teamID");

-- CreateIndex
CREATE UNIQUE INDEX "Address_addressID_key" ON "Address"("addressID");

-- CreateIndex
CREATE UNIQUE INDEX "Languages_Name_key" ON "Languages"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Languages_Code_key" ON "Languages"("Code");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_roleID_fkey" FOREIGN KEY ("roleID") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role_Resources" ADD CONSTRAINT "Role_Resources_resourcesID_fkey" FOREIGN KEY ("resourcesID") REFERENCES "Resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_teamID_fkey" FOREIGN KEY ("teamID") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_usersID_fkey" FOREIGN KEY ("usersID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_imagesId_fkey" FOREIGN KEY ("imagesId") REFERENCES "Images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles_Translation" ADD CONSTRAINT "Articles_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles_Translation" ADD CONSTRAINT "Articles_Translation_articlesId_fkey" FOREIGN KEY ("articlesId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address_Translation" ADD CONSTRAINT "Address_Translation_addressID_fkey" FOREIGN KEY ("addressID") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit_Translation" ADD CONSTRAINT "Unit_Translation_unitID_fkey" FOREIGN KEY ("unitID") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_languagesID_fkey" FOREIGN KEY ("languagesID") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Currency_Translation" ADD CONSTRAINT "Currency_Translation_currencyID_fkey" FOREIGN KEY ("currencyID") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

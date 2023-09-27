-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "announcementsId" TEXT,
ADD COLUMN     "propertyId" TEXT;

-- CreateTable
CREATE TABLE "Developer" (
    "id" TEXT NOT NULL,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "ViewTag" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "ParentID" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "Bedrooms" INTEGER NOT NULL,
    "Bacloney" BOOLEAN NOT NULL DEFAULT false,
    "BalconySize" DOUBLE PRECISION,
    "RentMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "RentMax" DOUBLE PRECISION,
    "Handover" TEXT,
    "FurnishingStatus" TEXT,
    "VacantStatus" TEXT,
    "Longitude" DOUBLE PRECISION,
    "Latitude" DOUBLE PRECISION,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "Purpose" TEXT NOT NULL,
    "PermitNumber" TEXT NOT NULL,
    "DEDNo" TEXT NOT NULL,
    "ReraNo" TEXT NOT NULL,
    "BRNNo" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "developerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aminities" (
    "id" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aminities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcements" (
    "id" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "Link" TEXT,
    "Rank" INTEGER,
    "Type" TEXT,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListWithUs" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Bedrooms" INTEGER NOT NULL,
    "Bacloney" BOOLEAN NOT NULL DEFAULT false,
    "Price" DOUBLE PRECISION NOT NULL,
    "Type" TEXT NOT NULL,
    "Purpose" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "guestInformationId" TEXT NOT NULL,

    CONSTRAINT "ListWithUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "Subject" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "guestInformationId" TEXT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestInformation" (
    "id" TEXT NOT NULL,
    "FullName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "IPAddress" TEXT NOT NULL,
    "PhoneNo" TEXT,
    "Gender" "Gender" NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnquiryForm" (
    "id" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "Purpose" TEXT NOT NULL,
    "Bedrooms" INTEGER NOT NULL,
    "PriceMin" DOUBLE PRECISION DEFAULT 0,
    "PriceMax" DOUBLE PRECISION,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "guestInformationId" TEXT NOT NULL,

    CONSTRAINT "EnquiryForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applicantion" (
    "id" TEXT NOT NULL,
    "YearsOfExp" DOUBLE PRECISION NOT NULL,
    "AreaSpecialty" TEXT,
    "CVURL" TEXT NOT NULL,
    "CVFileType" TEXT NOT NULL,
    "Message" TEXT NOT NULL,
    "LinkedInURL" TEXT,
    "Field" TEXT NOT NULL,
    "EnglishLvl" TEXT NOT NULL,
    "ArabicLevel" TEXT NOT NULL,
    "OtherLanguages" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "guestInformationId" TEXT NOT NULL,
    "jobsId" TEXT NOT NULL,

    CONSTRAINT "Applicantion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs" (
    "id" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "Type" TEXT NOT NULL,
    "WeekHours" TEXT NOT NULL,
    "Expired" BOOLEAN NOT NULL DEFAULT false,
    "ActiveStatus" BOOLEAN NOT NULL DEFAULT true,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "usersId" TEXT NOT NULL,

    CONSTRAINT "Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Developer_Translation" (
    "id" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "developerId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Developer_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category_Translation" (
    "id" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property_Translation" (
    "id" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcements_Translation" (
    "id" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "announcementsId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcements_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobs_Translation" (
    "id" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "jobsId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jobs_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aminities_Translation" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "languagesId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "aminitiesId" TEXT NOT NULL,

    CONSTRAINT "Aminities_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AminitiesToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AminitiesToProperty_AB_unique" ON "_AminitiesToProperty"("A", "B");

-- CreateIndex
CREATE INDEX "_AminitiesToProperty_B_index" ON "_AminitiesToProperty"("B");

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_announcementsId_fkey" FOREIGN KEY ("announcementsId") REFERENCES "Announcements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ParentID_fkey" FOREIGN KEY ("ParentID") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListWithUs" ADD CONSTRAINT "ListWithUs_guestInformationId_fkey" FOREIGN KEY ("guestInformationId") REFERENCES "GuestInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_guestInformationId_fkey" FOREIGN KEY ("guestInformationId") REFERENCES "GuestInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnquiryForm" ADD CONSTRAINT "EnquiryForm_guestInformationId_fkey" FOREIGN KEY ("guestInformationId") REFERENCES "GuestInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicantion" ADD CONSTRAINT "Applicantion_guestInformationId_fkey" FOREIGN KEY ("guestInformationId") REFERENCES "GuestInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicantion" ADD CONSTRAINT "Applicantion_jobsId_fkey" FOREIGN KEY ("jobsId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Developer_Translation" ADD CONSTRAINT "Developer_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Developer_Translation" ADD CONSTRAINT "Developer_Translation_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Translation" ADD CONSTRAINT "Category_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category_Translation" ADD CONSTRAINT "Category_Translation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property_Translation" ADD CONSTRAINT "Property_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property_Translation" ADD CONSTRAINT "Property_Translation_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements_Translation" ADD CONSTRAINT "Announcements_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcements_Translation" ADD CONSTRAINT "Announcements_Translation_announcementsId_fkey" FOREIGN KEY ("announcementsId") REFERENCES "Announcements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs_Translation" ADD CONSTRAINT "Jobs_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs_Translation" ADD CONSTRAINT "Jobs_Translation_jobsId_fkey" FOREIGN KEY ("jobsId") REFERENCES "Jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aminities_Translation" ADD CONSTRAINT "Aminities_Translation_aminitiesId_fkey" FOREIGN KEY ("aminitiesId") REFERENCES "Aminities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aminities_Translation" ADD CONSTRAINT "Aminities_Translation_languagesId_fkey" FOREIGN KEY ("languagesId") REFERENCES "Languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AminitiesToProperty" ADD CONSTRAINT "_AminitiesToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Aminities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AminitiesToProperty" ADD CONSTRAINT "_AminitiesToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

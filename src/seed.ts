import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './modules/master/roles/entities/role.entity';
import { User } from './modules/master/users/entities/user.entity';
import { UserRole } from './modules/master/users/entities/user-role.entity';
import { MasterProject } from './modules/master/project/entities/project.entity';
import { Project } from './modules/projects/entities/project.entity';
import { ProjectMember } from './modules/projects/entities/project-member.entity';
import { PurchaseOrder } from './modules/purchase-orders/entities/purchase-order.entity';
import { SalesOrder } from './modules/sales-orders/entities/sales-order.entity';
import { PoSoMember } from './modules/po-so-members/entities/po-so-member.entity';
import { ProjectStatus, PurchaseOrderStatus, SalesOrderStatus } from './common/enums';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Like } from 'typeorm';

interface RawProject {
  no: number;
  name: string;
  po: string;
  so: string;
  picClient: string;
  description: string;
  mandays: number;
  status: string;
  platform: string;
  startDate: string;
  endDate: string;
  ba: string[];
  uiux: string[];
  fe: string[];
  be: string[];
  remarks: string;
  updateDate: string;
}

const rawProjects: RawProject[] = [
  {
    no: 1,
    name: 'Polaris Sprint 6',
    po: '4100006096',
    so: 'X-SO-XXX',
    picClient: 'Isti',
    description: 'Forum, Dashboard Chart, Notifikasi, Import Peserta',
    mandays: 84,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '10-Mar-25',
    endDate: '17-Apr-25',
    ba: ['Tria', 'Hana', 'Acha'],
    uiux: ['Alit'],
    fe: ['Yoga', 'Rizal'],
    be: ['Nur Amalia', 'Internship (Adrian)', 'Internship (Syahandika)'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 2,
    name: 'Moana Overtime',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Enhancement fitur Overtime & Time Card',
    mandays: 85,
    status: 'CLOSED',
    platform: 'OS & Go, Gin',
    startDate: '03-Feb-25',
    endDate: '25-Mar-25',
    ba: ['Tria', 'Hana'],
    uiux: ['Hasan', 'Nicholas'],
    fe: ['Hasan', 'Nicholas'],
    be: ['Bagus', 'Fazri'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 3,
    name: 'Prime Time Ultimate Sprint 3',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Isti',
    description: 'Prime Time: Meeting AI +  Form D Enhancement',
    mandays: 130,
    status: 'CLOSED',
    platform: 'OS & BE',
    startDate: '26-Jun-25',
    endDate: '10-Aug-25',
    ba: ['Acha'],
    uiux: ['Dinar'],
    fe: ['Akmal', 'Arya'],
    be: ['Tsel'],
    remarks: 'RFS: 9-Agu-2024',
    updateDate: '15-Dec-25'
  },
  {
    no: 4,
    name: 'ODC - HCM Career Page Awal',
    po: '4100006461',
    so: 'X-SO-XXX',
    picClient: 'Isti',
    description: 'Migrasi ke ODC Cloud',
    mandays: 423,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '20-Jan-25',
    endDate: '28-Apr-25',
    ba: ['Indira'],
    uiux: ['Adam'],
    fe: ['Iqbal', 'Ivanowsky', 'Faton', 'Diaz'],
    be: ['Ivanowsky', 'Bob', 'David'],
    remarks: 'Sementara sampai SIT karena WAF. Mandays 423 sheet Timeline ODC Awal',
    updateDate: '15-Dec-25'
  },
  {
    no: 5,
    name: 'Moana - Teresa (Approval NGPAM)',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi approval NGPAM (akses server/security) di Moana',
    mandays: 30,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '15-Apr-25',
    endDate: '29-Jul-25',
    ba: ['Acha'],
    uiux: [],
    fe: ['Dandi'],
    be: ['Nicholas', 'Dandi'],
    remarks: 'RFS: 29 Juli 2025',
    updateDate: '15-Dec-25'
  },
  {
    no: 6,
    name: 'Moana - Leader Dashboard phase 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Dashboard yang digunakan atasan untuk melihat jam kerja dan overtime karyawan serta absensi karyawan',
    mandays: 32,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '10-Jan-25',
    endDate: '09-Apr-25',
    ba: ['Tria', 'Sayyid'],
    uiux: [],
    fe: ['Nicholas', 'Hasan'],
    be: [],
    remarks: 'BA sebelumnya Hadid & Suwardi kemudian di Handover ke Tria & Sayyid',
    updateDate: '15-Dec-25'
  },
  {
    no: 7,
    name: 'Moana - Personal Family Info',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk menambahkan informasi keluarga karyawan',
    mandays: 80,
    status: 'CLOSED',
    platform: 'OS & Typescript, Nest.js',
    startDate: '04-Mar-25',
    endDate: '06-May-25',
    ba: ['Suwardi', 'Hadid'],
    uiux: [],
    fe: ['Hasan'],
    be: ['Fazri', 'Bagus'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 8,
    name: 'Moana - Telemedicine Phase 1',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk melakukan appointment dengan dokter',
    mandays: 21,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '11-Apr-25',
    endDate: '26-Jun-25',
    ba: ['Suwardi', 'Hadid', 'Tria'],
    uiux: [],
    fe: ['Tsel'],
    be: [],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 9,
    name: 'Moana - Telemedicine Phase 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Revamp telemedicine phase 1',
    mandays: 14,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '07-May-25',
    endDate: '30-Jun-25',
    ba: ['Suwardi', 'Hadid', 'Tria'],
    uiux: [],
    fe: ['Tsel'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 10,
    name: 'Moana - Telemedicine Phase 3',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Meeting AI & Medical Record (web dan mobile)',
    mandays: 61,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '17-Jul-25',
    endDate: '16-Sep-25',
    ba: ['Tria'],
    uiux: [],
    fe: ['Nicholas', 'Andi'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 11,
    name: 'Leadership Kit',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk memberikan materi Leadership dan benefit jabatan baru melalui email',
    mandays: 43,
    status: 'CLOSED',
    platform: 'PHP YII',
    startDate: '04-Jun-25',
    endDate: '03-Jul-25',
    ba: ['Hadid', 'Tria'],
    uiux: [],
    fe: ['Fahrul', 'Dean'],
    be: [],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 12,
    name: 'Sijep Phase 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk memberikan informasi benefit menjelang pensiun',
    mandays: 19.5,
    status: 'CLOSED',
    platform: 'PHP YII',
    startDate: '18-Jun-25',
    endDate: '03-Jul-25',
    ba: ['Hadid', 'Sayyid'],
    uiux: [],
    fe: [],
    be: ['Bagus', 'Fazri'],
    remarks: 'Menunggu requirement perhitungan dari mba Alya',
    updateDate: '15-Dec-25'
  },
  {
    no: 13,
    name: 'IPMS360 (CA MAWP) Sprint 1',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk melakukan assessment terhadap karyawan',
    mandays: 14.5,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '11-Jul-25',
    endDate: '31-Jul-25',
    ba: ['Hadid', 'Sayyid'],
    uiux: ['Hasan'],
    fe: ['Hasan'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 14,
    name: 'IPMS360 (CA MAWP) Sprint 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk melakukan assessment terhadap karyawan',
    mandays: 5.5,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '01-Aug-25',
    endDate: '10-Aug-25',
    ba: ['Hadid', 'Sayyid'],
    uiux: ['Hasan'],
    fe: ['Hasan'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 15,
    name: 'IPMS360 (CA MAWP) Sprint 3',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi untuk melakukan assessment terhadap karyawan',
    mandays: 5,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '12-Aug-25',
    endDate: '18-Aug-25',
    ba: ['Hadid', 'Sayyid'],
    uiux: ['Hasan'],
    fe: ['Hasan'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 16,
    name: 'Enhance B0 Indihome',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Isti',
    description: 'Enhancement fitur Form Request Indihome',
    mandays: 17,
    status: 'CLOSED',
    platform: 'PHP YII',
    startDate: '11-Aug-25',
    endDate: '15-Aug-25',
    ba: ['Hadid', 'Tria'],
    uiux: [],
    fe: [],
    be: ['Rayo', 'Dean'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 17,
    name: 'Functional Consultant',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Tsel',
    description: 'PIC backup Istiningdyah Saptarini April 2025 - Juli 2025',
    mandays: 80,
    status: 'CLOSED',
    platform: '',
    startDate: '01-Apr-25',
    endDate: '30-Jul-25',
    ba: [],
    uiux: [],
    fe: [],
    be: ['Trifera'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 18,
    name: 'Data Access & UAM',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Penambahan tab family info dan download pdf pada employee info, penambahan filter download dan menu baru',
    mandays: 301,
    status: 'CLOSED',
    platform: 'PHP YII',
    startDate: '15-Aug-25',
    endDate: '17-Dec-25',
    ba: ['Sayyid'],
    uiux: [],
    fe: [],
    be: ['Dimas', 'Dean', 'Suwandi', 'Jansen'],
    remarks: '',
    updateDate: '17-Dec-25'
  },
  {
    no: 19,
    name: 'Talent Managemement - Moana AI Job Matching (Job Calculator)',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Aplikasi Moana berupa dashboard yang berikan informasi terkait rotasi/stay posisi employee, pada dashboard dapat melihat list employe, list candidat, and comparison antar employee',
    mandays: 200,
    status: 'FUT',
    platform: 'OS',
    startDate: '27-Oct-25',
    endDate: '13-Mar-26',
    ba: ['Tria', 'Sayyid'],
    uiux: [],
    fe: ['Nicho', 'Hasan'],
    be: ['Fazri', 'Suwandi', 'Tubagus'],
    remarks: 'FUT: 22 Desember 2025 - 30 Januari 2026',
    updateDate: '07-Jan-26'
  },
  {
    no: 20,
    name: 'Moana - Ticketing',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Alvin',
    description: 'Chatbot yang bisa melakukan assign ticket',
    mandays: 33,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '15-May-25',
    endDate: '20-Jun-25',
    ba: ['Tria'],
    uiux: [],
    fe: ['Nicholas'],
    be: ['Andi'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 21,
    name: 'HCM Career Page Phase 3 Sprint 1',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Telkomsel Isti',
    description: 'Pengembangan Fitur Recruitment',
    mandays: 174,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '02-Jun-25',
    endDate: '22-Aug-25',
    ba: ['Indira', 'Rizal'],
    uiux: ['Alit'],
    fe: [],
    be: ['Arya', 'Asep', 'Nadi', 'Nur Amalia', 'Cindy', 'Andreas'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 22,
    name: 'HCM Career Page Phase 3 Sprint 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Telkomsel Isti',
    description: 'Aplikasi untuk proses Rekrutmen Tsel',
    mandays: 232,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '04-Sep-25',
    endDate: '05-Mar-26',
    ba: ['Indira'],
    uiux: ['Dinar', 'Alit'],
    fe: [],
    be: ['Iqbal', 'Arya', 'Nadi', 'Asep'],
    remarks: '',
    updateDate: '26-Mar-26'
  },
  {
    no: 23,
    name: 'SIAD Mobile Enhancment Internship 2025',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Defri',
    description: 'Aplikasi Untuk Karyawan Non-Organik(Intership) Tsel',
    mandays: 150,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '30-Jun-25',
    endDate: '28-Oct-25',
    ba: ['Indira', 'Shafiera'],
    uiux: [],
    fe: ['Akmal'],
    be: [],
    remarks: '',
    updateDate: '17-Dec-25'
  },
  {
    no: 24,
    name: 'ODC - HCM Career Page DPP Phase 1',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Isti',
    description: 'Migrasi ke ODC Cloud',
    mandays: 88,
    status: 'CLOSED',
    platform: 'ODC',
    startDate: '12-Jun-25',
    endDate: '29-Jul-25',
    ba: ['Indira', 'Shafiera'],
    uiux: ['Adam'],
    fe: [],
    be: ['Iqbal', 'Ivanowsky', 'Faton', 'Diaz'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 25,
    name: 'ODC Career Page Phase 2',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Telkomsel Alvin',
    description: 'Migrasi Aplikasi Career Page ke ODC',
    mandays: 242,
    status: 'CLOSED',
    platform: 'ODC',
    startDate: '11-Aug-25',
    endDate: '31-Jan-26',
    ba: ['Indira', 'Sayyid'],
    uiux: ['Alit'],
    fe: [],
    be: ['Melvin', 'Nikolas', 'Ivanowsky', 'Dave', 'Rendy', 'Bagas', 'Andi', 'Rizky Nurmega'],
    remarks: 'Lisensi ODC tidak diperpanjang, per 31 Januari 2026 sudah habis',
    updateDate: '03-Mar-26'
  },
  {
    no: 26,
    name: 'Migrasi & Upgrade PHP Server (Phase 1)',
    po: 'M100006499',
    so: '2880501843',
    picClient: 'Telkomsel Alvin',
    description: 'Migrasi & Upgrade PHP versi 8.5',
    mandays: 185,
    status: 'CLOSED',
    platform: 'PHP',
    startDate: '18-Jul-25',
    endDate: '26-Feb-26',
    ba: ['Putri'],
    uiux: [],
    fe: ['Adam'],
    be: ['Suwandi', 'Dean', 'Jansen', 'Tubagus', 'Dimas', 'Rayo', 'Vernanda', 'Fazri'],
    remarks: '- Deploy To Production : 05 Maret 2026\nMonitoring s.d 31 Maret',
    updateDate: '08-Apr-26'
  },
  {
    no: 27,
    name: 'Enhancement Postponed Leave Moana',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Telkomsel Alvin',
    description: 'Aplikasi Mobile Moana untuk Proses Postpone Leave di Moana',
    mandays: 36,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '20-Oct-25',
    endDate: '28-Oct-25',
    ba: ['Sayyid'],
    uiux: [],
    fe: ['Tsel'],
    be: ['Jansen', 'Fazri', 'Tubagus'],
    remarks: 'Development menunggu BU dari TSEL, semua task yang di berikan sudah 100%',
    updateDate: '26-Dec-25'
  },
  {
    no: 28,
    name: 'Leader Dashboard Insight',
    po: 'X-PO-XXX',
    so: 'X-SO-XXX',
    picClient: 'Telkomsel Alvin',
    description: 'Aplikasi Mobile Moana untuk Leader Dashboard Insight di Moana',
    mandays: 5,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '30-Oct-25',
    endDate: '17-Nov-25',
    ba: ['Sayyid'],
    uiux: [],
    fe: ['Tsel'],
    be: ['Tsel'],
    remarks: '',
    updateDate: '15-Dec-25'
  },
  {
    no: 29,
    name: 'Talent Management OD',
    po: '4200052151',
    so: 'X-SO-XXX',
    picClient: 'Royan',
    description: 'Aplikasi web berfungsi untuk pengajuan organisasi berintegrasi dengan AI',
    mandays: 7,
    status: 'CLOSED',
    platform: 'OS',
    startDate: '10-Dec-25',
    endDate: '19-Dec-25',
    ba: ['Tria'],
    uiux: [],
    fe: ['Tsel'],
    be: ['Tsel'],
    remarks: 'Develop masih berjalan berbarengan dengan documentation',
    updateDate: '23-Dec-25'
  }
];

function parseDateString(str: string): Date | null {
  if (!str || str.trim() === '' || str === '#NULL!') return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const monthStr = parts[1].toLowerCase();
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;

  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };
  const month = months[monthStr];
  if (month === undefined) return null;
  return new Date(year, month, day);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);

  const defaultPassword = configService.get<string>('DEFAULT_PASSWORD', 'Password123');
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  console.log('--- Starting Database Seeder ---');

  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  const userRoleRepo = dataSource.getRepository(UserRole);
  const masterProjectRepo = dataSource.getRepository(MasterProject);
  const projectRepo = dataSource.getRepository(Project);
  const memberRepo = dataSource.getRepository(ProjectMember);
  const poRepo = dataSource.getRepository(PurchaseOrder);
  const soRepo = dataSource.getRepository(SalesOrder);
  const poSoMemberRepo = dataSource.getRepository(PoSoMember);

  // 1. Seed Roles
  const roles = [
    { code: 'ADMIN', name: 'Administrator', description: 'System Administrator' },
    { code: 'PM', name: 'Project Manager', description: 'Project Manager' },
    { code: 'BA', name: 'Business Analyst', description: 'Business Analyst' },
    { code: 'UIUX', name: 'UI/UX Designer', description: 'UI/UX Designer' },
    { code: 'DEV_FE', name: 'Developer Front-End', description: 'Developer Front-End' },
    { code: 'DEV_BE', name: 'Developer Back-End', description: 'Developer Back-End' },
    { code: 'TL', name: 'Tech Lead', description: 'Technical Lead' },
    { code: 'QC', name: 'Quality Control', description: 'Quality Control / Tester' },
  ];

  const savedRoles: Record<string, Role> = {};

  for (const r of roles) {
    let role = await roleRepo.findOneBy({ code: r.code });
    if (!role) {
      role = roleRepo.create(r);
      role = await roleRepo.save(role);
      console.log(`Created Role: ${r.code}`);
    } else {
      console.log(`Role already exists: ${r.code}`);
    }
    savedRoles[r.code] = role;
  }

  // Helper to get or create User and assign UserRole
  const getOrCreateUser = async (name: string, defaultRoleCode: string): Promise<User> => {
    const cleanedName = name.trim();
    const email = `${cleanedName.toLowerCase().replace(/[^a-z0-9]/g, '')}@mii.co.id`;
    let user = await userRepo.findOneBy({ email });
    if (!user) {
      const employeeId = `EMP-${cleanedName.toUpperCase().replace(/[^A-Z0-9]/g, '')}`.slice(0, 50);
      user = userRepo.create({
        email,
        fullName: cleanedName,
        passwordHash,
        employeeId,
        isActive: true,
      });
      user = await userRepo.save(user);
      console.log(`Created User: ${user.fullName} (${user.email})`);
    }

    // Ensure UserRole exists
    const role = savedRoles[defaultRoleCode];
    if (role) {
      const hasRole = await userRoleRepo.findOneBy({ userId: user.id, roleId: role.id });
      if (!hasRole) {
        const userRole = userRoleRepo.create({ user, role });
        await userRoleRepo.save(userRole);
        console.log(`Assigned role ${defaultRoleCode} to user ${user.fullName}`);
      }
    }

    return user;
  };

  // Keep track of project code count per year
  const countsByYear: Record<number, number> = {};

  for (const raw of rawProjects) {
    console.log(`\nProcessing Project #${raw.no}: ${raw.name}`);

    // Parse Dates
    const startDate = parseDateString(raw.startDate);
    const endDate = parseDateString(raw.endDate);

    const year = startDate ? startDate.getFullYear() : 2025;
    countsByYear[year] = (countsByYear[year] || 0) + 1;
    const projectCode = `HCM-${year}-${String(countsByYear[year]).padStart(3, '0')}`;

    // Map status
    let status = ProjectStatus.CLOSED;
    if (raw.status === 'FUT') {
      status = ProjectStatus.FUT;
    } else if (raw.status === 'PLANNING') {
      status = ProjectStatus.PLANNING;
    } else if (raw.status === 'IN_PROGRESS') {
      status = ProjectStatus.IN_PROGRESS;
    } else if (raw.status === 'SIT') {
      status = ProjectStatus.SIT;
    } else if (raw.status === 'UAT') {
      status = ProjectStatus.UAT;
    } else if (raw.status === 'ON_HOLD') {
      status = ProjectStatus.ON_HOLD;
    } else if (raw.status === 'CANCELLED') {
      status = ProjectStatus.CANCELLED;
    }

    // 1. Create or find MasterProject
    let masterProject = await masterProjectRepo.findOneBy({ name: raw.name });
    if (!masterProject) {
      const masterPayload = {
        projectCode,
        name: raw.name,
        description: raw.description,
        platform: raw.platform,
        isActive: true,
      };
      const newMaster = masterProjectRepo.create(masterPayload as any) as unknown as MasterProject;
      masterProject = await masterProjectRepo.save(newMaster);
      console.log(`Created MasterProject: ${masterProject.name} (${masterProject.projectCode})`);
    } else {
      console.log(`MasterProject already exists: ${masterProject.name}`);
    }

    // 2. Create or find Project (ex project_header) linked to master
    let project = await projectRepo.findOneBy({ projectId: masterProject.id });
    if (!project) {
      const projectPayload = {
        projectId: masterProject.id,
        picClient: raw.picClient,
        customer: 'Telkomsel',
        status,
        totalMandays: raw.mandays,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        remarks: raw.remarks,
        isActive: true,
      };
      const newProj = projectRepo.create(projectPayload as any) as unknown as Project;
      project = await projectRepo.save(newProj);
      console.log(`Created Project: id=${project.id} for master ${masterProject.name}`);
    } else {
      console.log(`Project already exists for master: ${masterProject.name}`);
    }

    const activeProject: Project = project!;

    // Create PurchaseOrder (only if it has a real PO number)
    let po: PurchaseOrder | null = null;
    const hasRealPO = raw.po && raw.po !== 'X-PO-XXX' && raw.po.trim() !== '';
    if (hasRealPO) {
      po = await poRepo.findOneBy({ poNumber: raw.po });
      if (!po) {
        const poPayload = {
          poNumber: raw.po,
          poName: `PO - ${raw.name}`,
          projectId: activeProject.id,
          customer: 'Telkomsel',
          description: raw.description,
          totalMandays: raw.mandays,
          status: PurchaseOrderStatus.CLOSED,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          isActive: true,
        };
        const newPo = poRepo.create(poPayload as any) as unknown as PurchaseOrder;
        po = await poRepo.save(newPo);
        console.log(`Created PurchaseOrder: ${po.poNumber} for Project: ${masterProject.name}`);
      } else {
        console.log(`PurchaseOrder ${po.poNumber} already exists`);
      }
    }

    const activePo: PurchaseOrder | null = po;

    // Create SalesOrder (only if it has a real SO number and a real PO number was successfully saved)
    let so: SalesOrder | null = null;
    const hasRealSO = raw.so && raw.so !== 'X-SO-XXX' && raw.so.trim() !== '';
    if (hasRealSO && activePo) {
      so = await soRepo.findOneBy({ soNumber: raw.so });
      if (!so) {
        const soPayload = {
          soNumber: raw.so,
          soName: `SO - ${raw.name}`,
          poId: activePo.id,
          projectId: activeProject.id,
          totalMandays: raw.mandays,
          status: SalesOrderStatus.CLOSED,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          isActive: true,
        };
        const newSo = soRepo.create(soPayload as any) as unknown as SalesOrder;
        so = await soRepo.save(newSo);
        console.log(`Created SalesOrder: ${so.soNumber} for Project: ${masterProject.name}`);
      } else {
        console.log(`SalesOrder ${so.soNumber} already exists`);
      }
    }

    const activeSo: SalesOrder | null = so;

    // Helper to process members for a specific role
    const processMembers = async (names: string[], roleCode: string) => {
      const role = savedRoles[roleCode];
      if (!role) return;

      for (const name of names) {
        if (!name.trim()) continue;
        const user = await getOrCreateUser(name, roleCode);

        // Check if member already assigned to project with this role
        let member = await memberRepo.findOneBy({
          projectId: activeProject.id,
          userId: user.id,
          roleId: role.id,
        });

        if (!member) {
          const memberPayload = {
            projectId: activeProject.id,
            userId: user.id,
            roleId: role.id,
            assignedMandays: 0,
            actualMandays: 0,
            isActive: true,
          };
          const newMember = memberRepo.create(memberPayload as any) as unknown as ProjectMember;
          member = await memberRepo.save(newMember);
          console.log(`Assigned User ${user.fullName} to Project ${masterProject.name} as ${roleCode}`);
        }

        const activeMember: ProjectMember = member!;

        // If PO exists, assign this ProjectMember to PO and SO in PoSoMember
        if (activePo) {
          let poSoMember = await poSoMemberRepo.findOneBy({
            poId: activePo.id,
            projectMemberId: activeMember.id,
            roleId: role.id,
          });

          if (!poSoMember) {
            const poSoMemberPayload = {
              poId: activePo.id,
              soId: activeSo ? activeSo.id : undefined,
              projectMemberId: activeMember.id,
              roleId: role.id,
              actualMandays: 0,
              actualHours: 0,
              ratePerManday: 0,
              totalCost: 0,
              startDate: startDate || undefined,
              endDate: endDate || undefined,
              isBillable: true,
            };
            const newPoSoMember = poSoMemberRepo.create(poSoMemberPayload as any) as unknown as PoSoMember;
            await poSoMemberRepo.save(newPoSoMember);
            console.log(`Linked member ${user.fullName} to PO ${activePo.poNumber} in role ${roleCode}`);
          }
        }
      }
    };

    // Process members for each role
    await processMembers(raw.ba, 'BA');
    await processMembers(raw.uiux, 'UIUX');
    await processMembers(raw.fe, 'DEV_FE');
    await processMembers(raw.be, 'DEV_BE');
  }

  console.log('\n--- Seeder Finished ---');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Seeder failed', err);
  process.exit(1);
});

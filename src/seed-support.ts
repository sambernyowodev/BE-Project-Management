import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { SupportTicket } from './modules/support-tickets/entities/support-ticket.entity';
import { SupportTicketAssignee } from './modules/support-tickets/entities/support-ticket-assignee.entity';
import { MasterProject } from './modules/master/project/entities/project.entity';
import { Project } from './modules/projects/entities/project.entity';
import { User } from './modules/master/users/entities/user.entity';
import {
  SupportTicketStatus,
  SupportTicketDetailStatus,
  ProjectStatus,
} from './common/enums';

interface RawSupportDetail {
  subIssue: string;
  hoursSpent: number;
  status: string;
  startDate: string;
  endDate: string;
  devBeNames?: string;
  platform?: string;
}

interface RawSupportTicket {
  no: number;
  projectName: string;
  poNumber: string;
  soNumber: string;
  customer: string;
  issue: string;
  hours: number;
  status: string;
  platform: string;
  startDate: string;
  endDate: string;
  businessAnalyst?: string;
  uiUx?: string;
  devFe?: string;
  devBe?: string;
  attachments?: string;
  updateDate?: string;
  notes?: string;
  details?: RawSupportDetail[];
}

const rawTickets: RawSupportTicket[] = [
  {
    no: 2,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting & Perbaikan formula manfaat pensiun',
    hours: 0.5,
    status: 'Done',
    platform: 'OS',
    startDate: '08-Oct-25',
    endDate: '08-Oct-25',
    devFe: 'Fazri',
  },
  {
    no: 20,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Menangani request cuti yang tidak bisa withdraw',
    hours: 5,
    status: 'Done',
    platform: 'OS',
    startDate: '22-Sep-25',
    endDate: '22-Sep-25',
    devFe: 'Fazri',
  },
  {
    no: 22,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Persiapan query ddl dan config SIJEP untuk deployment',
    hours: 7,
    status: 'Done',
    platform: 'OS',
    startDate: '19-Sep-25',
    endDate: '19-Sep-25',
    devFe: 'Fazri',
  },
  {
    no: 23,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Deployment SIJEP',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '19-Sep-25',
    endDate: '19-Sep-25',
    devFe: 'Fazri',
  },
  {
    no: 24,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Membantu FE Tsel inject attachment untuk perbaikan attachment corrupt',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '19-Sep-25',
    endDate: '19-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 25,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Deployment SIJEP',
    hours: 6,
    status: 'Done',
    platform: 'OS',
    startDate: '19-Sep-25',
    endDate: '19-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 27,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Ubah copywriting dan menambahkan kondisi sesuai dengan jenis benefit dan perbaikan page detail BTKMP Yakes dengan menambahkan dokumen baru',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '18-Sep-25',
    endDate: '18-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 28,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Perbaikan formula yang tidak tepat untuk manfaat pensiun',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '30-Sep-25',
    endDate: '30-Sep-25',
    devBe: 'Fazri',
  },
  {
    no: 29,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting dan cek data prod dengan user',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '30-Sep-25',
    endDate: '30-Sep-25',
    devBe: 'Tubagus',
  },
  {
    no: 39,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting dan perbaikan query formula',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '16-Sep-25',
    endDate: '16-Sep-25',
    devFe: 'Fazri',
  },
  {
    no: 40,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting dengan user dan sedikit perbaikan bug',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '16-Sep-25',
    endDate: '16-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 42,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting dan pengecekan balance cuti yang tidak valid',
    hours: 6,
    status: 'Done',
    platform: 'OS',
    startDate: '15-Sep-25',
    endDate: '15-Sep-25',
    devFe: 'Fazri',
  },
  {
    no: 43,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Cek api cubes profile dengan user dan team ebs oracle karena balance selalus 0',
    hours: 7,
    status: 'Done',
    platform: 'OS',
    startDate: '15-Sep-25',
    endDate: '15-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 50,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Cek error dan withdraw cuti dari api prod',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '10-Sep-25',
    endDate: '10-Sep-25',
    devFe: 'Tubagus',
  },
  {
    no: 56,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Perubahan logic tampilan manfaat pensiun berdasarkan formula terbaru',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '08-Sep-25',
    endDate: '08-Sep-25',
    devBe: 'Fazri',
  },
  {
    no: 57,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Perbaikan setelah diskusi dengan user',
    hours: 6,
    status: 'Done',
    platform: 'OS',
    startDate: '08-Sep-25',
    endDate: '08-Sep-25',
    devBe: 'Tubagus',
  },
  {
    no: 62,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Meeting pengecekan formula baru SIJEP',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '04-Sep-25',
    endDate: '04-Sep-25',
    devBe: 'Fazri',
  },
  {
    no: 63,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Diskusi dan cek SIJEP Phase 2 dengan user',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '04-Sep-25',
    endDate: '04-Sep-25',
    devBe: 'Tubagus',
  },
  {
    no: 67,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Cek log error internal server karena panjang kolom pada table tidak sesuai',
    hours: 4,
    status: 'Done',
    platform: 'OS',
    startDate: '01-Sep-25',
    endDate: '01-Sep-25',
    devBe: 'Tubagus',
  },
  {
    no: 89,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Melakukan identifikasi terhadap error api withdraw leave karena absence id null',
    hours: 2,
    status: 'Done',
    platform: 'OS',
    startDate: '11-Aug-25',
    endDate: '11-Aug-25',
    devBe: 'Tubagus',
  },
  {
    no: 135,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      "Wording Leave Type 'Ijin Karena Sakit' berubah menjadi 'Ijin Karena Keperluan Pribadi' ketika belum upload attachment",
    hours: 6,
    status: 'Done',
    platform: 'OS',
    startDate: '02-Jul-25',
    endDate: '02-Jul-25',
    devFe: 'Andi',
  },
  {
    no: 136,
    projectName: 'Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: "Fixing wording leave type 'Ijin' menjadi 'Izin'",
    hours: 6,
    status: 'Done',
    platform: 'OS',
    startDate: '02-Jul-25',
    endDate: '02-Jul-25',
    devFe: 'Andi',
  },
  {
    no: 363,
    projectName: 'Moana Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Raihan Jana Prasetya',
    issue: 'cek pengajuan cuti tidak sesuai dan bantu ubah data by api',
    hours: 0.5,
    status: 'Done',
    platform: 'Typescript/NestJs',
    startDate: '10-Oct-25',
    endDate: '10-Oct-25',
    devBe: 'Fazri',
  },
  {
    no: 364,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Raihan Jana Prasetya',
    issue: 'Auto save draft offline recording meeting AI setiap 5 menit',
    hours: 80,
    status: 'Done',
    platform: 'OS',
    startDate: '20-Oct-25',
    endDate: '31-Oct-25',
    businessAnalyst: 'Acha',
    devFe: 'Akmal',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '10-Oct-25',
  },
  {
    no: 365,
    projectName: 'Moana Personal Info',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Agit Kurniawan',
    issue: 'cek pengajuan bantuan duka attachment tidak tersimpan',
    hours: 1,
    status: 'Done',
    platform: 'Typescript/NestJs',
    startDate: '11-Nov-25',
    endDate: '11-Nov-25',
    devBe: 'Tubagus',
  },
  {
    no: 366,
    projectName: 'Polaris',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Royan Bakhtiar',
    issue:
      'Penambahan kolom Username pada menu Role user di Backoffice Polaris',
    hours: 2,
    status: 'Done',
    platform: 'OS',
    startDate: '20-Nov-25',
    endDate: '20-Nov-25',
    businessAnalyst: 'Tria',
    devBe: 'Yoga',
    updateDate: '20-Nov-25',
  },
  {
    no: 1,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Raihan Jana Prasetya',
    issue: 'Rollback form LXP (Form D) on Prime Time Dev',
    hours: 80,
    status: 'SIT Done',
    platform: 'OS',
    startDate: '03-Feb-26',
    endDate: '16-Feb-26',
    businessAnalyst: 'Acha',
    devFe: 'Akmal',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '10-Mar-26',
    notes:
      'SIT by user done. Confirmed dari user di hold di dev dulu (belum perlu publish ke prod).',
  },
  {
    no: 2,
    projectName: 'Refreshment Server 38 Phase 1',
    poNumber: '4200052405',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Penyesuaian api employee picture dan clear cache',
    hours: 2.5,
    status: 'Done',
    platform: 'PHP',
    startDate: '16-Feb-26',
    endDate: '16-Feb-26',
    devBe: 'Tubagus, Fazri, Jansen',
    updateDate: '04-Mar-26',
  },
  {
    no: 3,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Mas Royan',
    issue:
      'Hide field input feedback notes & update wording untuk popup Feedback to Direct Leader',
    hours: 2,
    status: 'Done',
    platform: 'OS',
    startDate: '27-Feb-26',
    endDate: '27-Feb-26',
    businessAnalyst: 'Acha',
    devFe: 'Arya',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '02-Mar-26',
  },
  {
    no: 4,
    projectName: 'Prime Time MOANA',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Mas Royan',
    issue:
      'Hide field input feedback notes & update wording untuk popup Feedback to Direct Leader',
    hours: 2,
    status: 'Done',
    platform: 'OS',
    startDate: '27-Feb-26',
    endDate: '27-Feb-26',
    businessAnalyst: 'Acha',
    devFe: 'Nicholas',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '02-Mar-26',
  },
  {
    no: 5,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Mas Royan',
    issue: 'Penambahan loading di landing page prime time with AI',
    hours: 1,
    status: 'Done',
    platform: 'OS',
    startDate: '24-Apr-26',
    endDate: '24-Apr-26',
    businessAnalyst: 'Acha',
    devFe: 'Akmal',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '29-Apr-26',
  },
  {
    no: 6,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Arif Nur Rahman',
    issue:
      'Update query API list employee dari "superior" ke "name" untuk get list all superior untuk popup edit superior ketika status masih not started & edit superior di dalam detail employee',
    hours: 3,
    status: 'Done',
    platform: 'OS',
    startDate: '29-Apr-26',
    endDate: '29-Apr-26',
    businessAnalyst: 'Acha',
    devFe: 'Akmal',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '29-Apr-26',
  },
  {
    no: 7,
    projectName: 'SIJEP',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Mba Aliya',
    issue: 'SIJEP Support Details',
    hours: 56,
    status: 'DONE',
    platform: 'PHP',
    startDate: '4 Maret 2026',
    endDate: '18-May-26',
    details: [
      {
        subIssue: 'Fixing kolom tanda tangan',
        hoursSpent: 8,
        status: 'DONE',
        startDate: '4 Maret 2026',
        endDate: '04-Apr-26',
        devBeNames: 'Suwandi',
        platform: 'PHP',
      },
      {
        subIssue: 'Fixing font size preview',
        hoursSpent: 8,
        status: 'DONE',
        startDate: '5 Maret 2026',
        endDate: '5 Maret 2026',
        devBeNames: 'Fazri, Bagus',
      },
      {
        subIssue: 'Fixing download paper (time frame)',
        hoursSpent: 8,
        status: 'DONE',
        startDate: '9 Maret 2026',
        endDate: '9 Maret 2026',
      },
      {
        subIssue: 'Delete benefit',
        hoursSpent: 4,
        status: 'DONE',
        startDate: '9 Maret 2026',
        endDate: '9 Maret 2026',
      },
      {
        subIssue: 'Fixing download paper nge refresh',
        hoursSpent: 8,
        status: 'On Progress Development',
        startDate: '10 Maret 2026',
        endDate: '10 Maret 2026',
      },
      {
        subIssue: 'Fixing perhitungan CLTP tidak terbaca',
        hoursSpent: 8,
        status: 'DONE',
        startDate: '21-Apr-26',
        endDate: '21-Apr-26',
      },
      {
        subIssue: 'Menyembunyikan form sijep dan update logo pada form',
        hoursSpent: 4,
        status: 'DONE',
        startDate: '15-May-26',
        endDate: '15-May-26',
        platform: 'PHP',
      },
      {
        subIssue:
          'Menambahkan filter dan sort pada kolom tgl lahir, nik, nama dan membuat halaman sijep moniroting untuk karyawan sudah pensiun',
        hoursSpent: 8,
        status: 'DONE',
        startDate: '18-May-26',
        endDate: '18-May-26',
        platform: 'PHP',
      },
    ],
  },
  {
    no: 8,
    projectName: 'Prime Time Web',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Raihan Jana Prasetya',
    issue:
      'Hide submenu Employee Profile & Working Principle dari all form (form non ai, form meeting ai, form update admin)',
    hours: 1,
    status: 'Done',
    platform: 'OS',
    startDate: '25-May-26',
    endDate: '25-May-26',
    businessAnalyst: 'Acha',
    devFe: 'Akmal',
    attachments: 'TImeline Backlog Prime Time',
    updateDate: '25-May-26',
  },
  {
    no: 9,
    projectName: 'Moana Personal Info',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Menambahkan validasi marriage book dan upload attachment marriage book',
    hours: 8,
    status: 'Done',
    platform: 'Nestjs',
    startDate: '15-Jan-26',
    endDate: '16-Jan-26',
    devBe: 'Bagus',
  },
  {
    no: 10,
    projectName: 'Moana Personal Info',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue:
      'Update api edit contact biar menggunakan effective date ketika type OTHER',
    hours: 4,
    status: 'Done',
    platform: 'Nestjs',
    startDate: '23-Mar-26',
    endDate: '23-Mar-26',
    devBe: 'Bagus',
  },
  {
    no: 11,
    projectName: 'Moana Leave',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Memperbaiki query postpone leave history dan api postpone profile',
    hours: 8,
    status: 'Done',
    platform: 'Nestjs',
    startDate: '03-May-26',
    endDate: '03-May-26',
    devBe: 'Bagus',
  },
  {
    no: 12,
    projectName: 'Moana Overtime',
    poNumber: 'X-PO-XXX',
    soNumber: 'X-SO-XXX',
    customer: 'Alvin Syarifudin Shahab',
    issue: 'Overtime Memperbaiki pembulatan pada actual duration',
    hours: 2,
    status: 'Done',
    platform: 'Nestjs',
    startDate: '20-May-26',
    endDate: '20-May-26',
    devBe: 'Bagus',
  },
];

function parseDateString(str: string): Date | null {
  if (!str || str.trim() === '' || str === '#NULL!') return null;

  // Replace Indonesian Month Names
  const cleaned = str
    .toLowerCase()
    .replace(/maret/g, 'mar')
    .replace(/mei/g, 'may')
    .replace(/\s+/g, '-');

  // Handle slashes
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 3) {
      // MM/DD/YYYY format
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }

  const parts = cleaned.split('-');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const monthStr = parts[1];
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000;

  const months: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };
  const month = months[monthStr];
  if (month === undefined) return null;
  return new Date(year, month, day);
}

function mapStatus(statusStr: string): SupportTicketStatus {
  const s = statusStr.trim().toUpperCase();
  if (s === 'DONE' || s === 'DONE') return SupportTicketStatus.DONE;
  if (s === 'SIT DONE') return SupportTicketStatus.SIT_DONE;
  if (s === 'ON PROGRESS DEVELOPMENT' || s === 'IN PROGRESS')
    return SupportTicketStatus.IN_PROGRESS;
  if (s === 'ON HOLD') return SupportTicketStatus.ON_HOLD;
  if (s === 'CANCELLED') return SupportTicketStatus.CANCELLED;
  return SupportTicketStatus.OPEN;
}

function mapDetailStatus(statusStr: string): SupportTicketDetailStatus {
  const s = statusStr.trim().toUpperCase();
  if (s === 'DONE' || s === 'DONE') return SupportTicketDetailStatus.DONE;
  if (s === 'ON PROGRESS DEVELOPMENT' || s === 'IN PROGRESS')
    return SupportTicketDetailStatus.IN_PROGRESS;
  if (s === 'ON HOLD') return SupportTicketDetailStatus.ON_HOLD;
  return SupportTicketDetailStatus.OPEN;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('--- Starting Support Tickets Seeder ---');

  const ticketRepo = dataSource.getRepository(SupportTicket);
  const assigneeRepo = dataSource.getRepository(SupportTicketAssignee);
  const masterProjectRepo = dataSource.getRepository(MasterProject);
  const projectRepo = dataSource.getRepository(Project);
  const userRepo = dataSource.getRepository(User);

  // Cache users to avoid repeated DB calls
  const allUsers = await userRepo.find();
  const findUserByName = (name?: string): User | null => {
    if (!name) return null;
    const clean = name.trim().toLowerCase();
    return allUsers.find((u) => u.fullName.toLowerCase() === clean) || null;
  };

  const allMasterProjects = await masterProjectRepo.find();
  const matchMasterProject = (name: string): MasterProject | null => {
    let p = allMasterProjects.find(
      (x) => x.name.toLowerCase() === name.toLowerCase(),
    );
    if (p) return p;
    p = allMasterProjects.find(
      (x) =>
        x.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(x.name.toLowerCase()),
    );
    return p || null;
  };

  // Build a map of counts per year from existing project codes
  const countsByYear: Record<number, number> = {};
  for (const mp of allMasterProjects) {
    const match = mp.projectCode.match(/^HCM-(\d{4})-(\d{3})$/);
    if (match) {
      const yr = parseInt(match[1], 10);
      const seq = parseInt(match[2], 10);
      if (!countsByYear[yr] || seq > countsByYear[yr]) {
        countsByYear[yr] = seq;
      }
    }
  }

  let globalIndex = 1;

  for (const raw of rawTickets) {
    const startDate = parseDateString(raw.startDate);
    const endDate = parseDateString(raw.endDate);
    const updateDate = raw.updateDate ? parseDateString(raw.updateDate) : null;

    const year = startDate ? startDate.getFullYear() : 2025;
    const ticketCode = `SUP-${year}-${String(globalIndex++).padStart(4, '0')}`;

    let masterProject = matchMasterProject(raw.projectName);
    if (!masterProject) {
      const year = startDate ? startDate.getFullYear() : 2025;
      countsByYear[year] = (countsByYear[year] || 0) + 1;
      const projectCode = `HCM-${year}-${String(countsByYear[year]).padStart(3, '0')}`;

      const masterPayload = {
        projectCode,
        name: raw.projectName,
        description: `Created automatically during support ticket seeding for ${raw.projectName}`,
        platform: raw.platform || 'OS',
        isActive: true,
      };
      const newMaster = masterProjectRepo.create(
        masterPayload as any,
      ) as unknown as MasterProject;
      masterProject = await masterProjectRepo.save(newMaster);
      console.log(
        `Created MasterProject: ${masterProject.name} (${masterProject.projectCode})`,
      );

      // Add to cached list so we match it next time
      allMasterProjects.push(masterProject);

      // Create corresponding Project (header)
      const projectPayload = {
        projectId: masterProject.id,
        picClient: raw.customer || 'Unknown Client',
        customer: 'Telkomsel HCM',
        status: ProjectStatus.IN_PROGRESS,
        totalMandays: Number((raw.hours / 8).toFixed(2)),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        remarks: raw.notes || `Created for Support Ticket Seeding`,
        isActive: true,
      };
      const newProj = projectRepo.create(
        projectPayload as any,
      ) as unknown as Project;
      await projectRepo.save(newProj);
      console.log(
        `Created Project: id=${masterProject.id} for master ${masterProject.name}`,
      );
    }

    const baUser = findUserByName(raw.businessAnalyst);
    const uiuxUser = findUserByName(raw.uiUx);
    const feUser = findUserByName(raw.devFe);
    const beUser = findUserByName(raw.devBe);

    let ticket = await ticketRepo.findOneBy({ ticketCode });
    if (!ticket) {
      const ticketPayload = {
        ticketCode,
        masterProjectId: masterProject ? masterProject.id : null,
        customer: 'Telkomsel HCM',
        picClient: raw.customer || null,
        issueTitle: raw.issue,
        issueDescription: raw.issue,
        hoursSpent: raw.hours,
        mandaysSpent: Number((raw.hours / 8).toFixed(2)),
        status: mapStatus(raw.status),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        folderAttachment: raw.attachments || null,
        notes: raw.notes || null,
        updateDate: updateDate || undefined,
        isActive: true,
      };

      const newTicket = ticketRepo.create(
        ticketPayload as any,
      ) as unknown as SupportTicket;
      ticket = await ticketRepo.save(newTicket);
      console.log(
        `Created SupportTicket: ${ticket.ticketCode} - ${raw.projectName} (${ticket.issueTitle})`,
      );
    } else {
      console.log(`SupportTicket already exists: ${ticket.ticketCode}`);
    }

    // Insert Assignees
    const assigneesToInsert: { user: User; hoursSpent: number }[] = [];
    if (baUser) assigneesToInsert.push({ user: baUser, hoursSpent: 0 });
    if (uiuxUser) assigneesToInsert.push({ user: uiuxUser, hoursSpent: 0 });
    if (feUser) assigneesToInsert.push({ user: feUser, hoursSpent: 0 });
    if (beUser) assigneesToInsert.push({ user: beUser, hoursSpent: 0 });

    if (raw.details && raw.details.length > 0) {
      for (const rawDetail of raw.details) {
        if (rawDetail.devBeNames) {
          const names = rawDetail.devBeNames.split(',').map((n) => n.trim());
          for (const name of names) {
            const u = findUserByName(name);
            if (u && !assigneesToInsert.some((a) => a.user.id === u.id)) {
              assigneesToInsert.push({
                user: u,
                hoursSpent: rawDetail.hoursSpent,
              });
            }
          }
        }
      }
    }

    for (const item of assigneesToInsert) {
      const existingAssignee = await assigneeRepo.findOneBy({
        supportTicketId: ticket.id,
        userId: item.user.id,
      });
      if (!existingAssignee) {
        const assigneePayload = {
          supportTicketId: ticket.id,
          userId: item.user.id,
          hoursSpent:
            item.hoursSpent ||
            Number((raw.hours / (assigneesToInsert.length || 1)).toFixed(2)),
          status: mapDetailStatus(raw.status),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        };
        const newAssignee = assigneeRepo.create(
          assigneePayload as any,
        ) as unknown as SupportTicketAssignee;
        await assigneeRepo.save(newAssignee);
        console.log(`  -> Assigned Member: ${item.user.fullName}`);
      }
    }
  }

  console.log('\n--- Support Seeder Finished ---');
  await app.close();
}

bootstrap().catch((err) => {
  console.error('Support Seeder failed', err);
  process.exit(1);
});

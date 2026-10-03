import Project from '../models/Project.js';
import Document from '../models/Document.js';
import Task from '../models/Task.js';
import Decision from '../models/Decision.js';
import Issue from '../models/Issue.js';
import Milestone from '../models/Milestone.js';
import TimelineEvent from '../models/TimelineEvent.js';
import AIInsight from '../models/AIInsight.js';

export async function seedSmartClinicDemo(userId) {
  // Check if demo already exists for this user
  const existing = await Project.findOne({ userId, isDemo: true });
  if (existing) {
    return existing;
  }

  // Create demo project
  const project = await Project.create({
    userId,
    name: 'SmartClinic Management Platform',
    description: 'HIPAA-compliant telemedicine, electronic health record (EHR) sync, and automated patient consultation billing portal.',
    projectType: 'Healthcare SaaS Platform',
    status: 'On Track',
    teamMembers: ['Alex Rivers (Backend Lead)', 'Sarah Chen (Data Architect)', 'Elena Rostova (Frontend)', 'Michael Vance (Security Officer)'],
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    progress: 68,
    handoffReadiness: {
      score: 88,
      status: 'Ready',
      missingContext: ['E-Prescription SureScripts API sandbox keys pending from clinic IT director']
    },
    summary: 'The SmartClinic project has successfully finalized architectural migration to PostgreSQL and completed HIPAA AES-256 encryption. The critical payment integration blocker has been unblocked following client approval of Stripe. Upcoming release target is Nov 15, 2026.',
    currentSituation: 'Payment gateway integration is actively underway unblocked by Stripe approval. Next critical milestone is end-to-end webhook validation before Nov 15.',
    isDemo: true
  });

  const pId = project._id || project.id;

  // Documents
  const doc1 = await Document.create({
    projectId: pId,
    name: 'Sprint_24_Meeting_Notes.txt',
    fileType: 'TXT',
    category: 'Meeting Notes',
    extractedText: `SmartClinic Sprint 24 Sync - Date: Oct 24, 2026\nAttendees: Alex Rivers, Sarah Chen, Elena Rostova\n\n1. Payment Gateway:\nPayment integration is blocked until the client confirms the provider. Dr. Harrison expressed security concerns regarding HIPAA compliance and processing fees.\n\n2. E-Prescription:\nElena noted that we still lack sandbox API credentials for the external pharmacy bridge.\n\n3. Action Items:\n- Escalate payment provider sign-off to executive client sponsor.\n- Prepare fallback architecture diagram for Stripe vs PayPal Braintree.`,
    chunks: [
      { page: 1, section: 'Meeting Summary & Blockers', content: 'Payment integration is blocked until the client confirms the provider. Dr. Harrison expressed security concerns regarding HIPAA compliance.' },
      { page: 1, section: 'Action Items', content: 'Escalate payment provider sign-off to executive client sponsor.' }
    ],
    processingStatus: 'Completed',
    pageCount: 1,
    lineCount: 18,
    fileSize: '4.2 KB'
  });

  const doc2 = await Document.create({
    projectId: pId,
    name: 'Project_Tasks_Backlog.csv',
    fileType: 'CSV',
    category: 'Task List',
    extractedText: `TaskID,Title,Assignee,Priority,Status,Deadline,Dependencies\nTSK-101,PostgreSQL Schema Migration,Sarah Chen,High,Completed,2026-10-10,None\nTSK-102,HIPAA AES-256 Field Encryption,Michael Vance,High,Completed,2026-10-18,TSK-101\nTSK-103,Stripe Payment Gateway Integration,Alex Rivers,High,In Progress,2026-11-15,TSK-102\nTSK-104,E-Prescription SureScripts Bridge,Elena Rostova,Medium,Not Started,2026-12-01,TSK-103\nTSK-105,Automated Patient SMS Reminders,Unassigned,Low,Not Started,2026-12-10,None`,
    chunks: [
      { page: 1, section: 'Active Sprint Tasks', content: 'TSK-103, Stripe Payment Gateway Integration, Alex Rivers, High Priority, In Progress, Deadline: 2026-11-15' },
      { page: 1, section: 'Completed Deliverables', content: 'TSK-101 Database Migration (Sarah Chen), TSK-102 HIPAA Encryption (Michael Vance)' }
    ],
    processingStatus: 'Completed',
    pageCount: 1,
    lineCount: 6,
    fileSize: '2.8 KB'
  });

  const doc3 = await Document.create({
    projectId: pId,
    name: 'Client_Direct_Approval.docx',
    fileType: 'DOCX',
    category: 'Client Communication',
    extractedText: `MEMORANDUM - SmartClinic Healthcare Systems\nDate: Oct 28, 2026\nFrom: Dr. Robert Harrison, Chief Medical Informatics Officer\nTo: SmartClinic Product Team\nSubject: Formal Approval of Payment Gateway Provider\n\nFollowing our review with the compliance and financial audit committee, Stripe has been approved as the payment provider for all clinics. Dr. Harrison confirmed the Business Associate Agreement (BAA) meets our strict HIPAA guidelines. The team is authorized to proceed with live checkout integrations immediately. Please ensure readiness for launch on or before November 15, 2026.`,
    chunks: [
      { page: 1, section: 'Formal Approval', content: 'Stripe has been approved as the payment provider for all clinics. The team is authorized to proceed with live checkout integrations immediately.' },
      { page: 1, section: 'Deadline Notice', content: 'Please ensure readiness for launch on or before November 15, 2026.' }
    ],
    processingStatus: 'Completed',
    pageCount: 2,
    lineCount: 16,
    fileSize: '18.5 KB'
  });

  const doc4 = await Document.create({
    projectId: pId,
    name: 'Architecture_Handoff_Spec.pdf',
    fileType: 'PDF',
    category: 'Technical Documentation',
    extractedText: `SmartClinic Technical Architecture Specification v2.4\nLead Architect: Sarah Chen | Security Review: Michael Vance\n\nSection 1: Data Persistence Architecture\nAll patient consultation records and diagnostic logs must use AES-256 column-level encryption with keys managed in AWS KMS. Database migration to PostgreSQL completed on Oct 10, 2026, retiring legacy MongoDB storage to ensure ACID isolation for billing transactions.\n\nSection 2: Payment Webhook Security\nWebhook endpoints must verify the Stripe HMAC signature header using secret rotation every 90 days. Failed payment events trigger immediate SMS notifications to clinic administrators.`,
    chunks: [
      { page: 1, section: 'Data Persistence Architecture', content: 'All patient consultation records must use AES-256 encryption. Database migration to PostgreSQL completed on Oct 10, 2026.' },
      { page: 2, section: 'Payment Webhook Security', content: 'Webhook endpoints must verify the Stripe HMAC signature header using secret rotation.' }
    ],
    processingStatus: 'Completed',
    pageCount: 4,
    lineCount: 32,
    fileSize: '142 KB'
  });

  const doc1Id = doc1._id || doc1.id;
  const doc2Id = doc2._id || doc2.id;
  const doc3Id = doc3._id || doc3.id;
  const doc4Id = doc4._id || doc4.id;

  // Tasks
  await Task.create({
    projectId: pId,
    title: 'PostgreSQL Schema Migration & Data Pipeline',
    description: 'Migrated patient records and relational tables to PostgreSQL for strict ACID compliance.',
    status: 'Completed',
    priority: 'High',
    assignee: 'Sarah Chen',
    deadline: '2026-10-10',
    completedDate: '2026-10-10',
    dependencies: [],
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'Database migration to PostgreSQL completed on Oct 10, 2026, retiring legacy MongoDB storage.',
    pageNumber: 1,
    section: 'Data Persistence Architecture'
  });

  await Task.create({
    projectId: pId,
    title: 'HIPAA AES-256 Field Encryption',
    description: 'Implement column-level cryptographic hashing and AWS KMS key envelope encryption for patient consultation logs.',
    status: 'Completed',
    priority: 'High',
    assignee: 'Michael Vance',
    deadline: '2026-10-18',
    completedDate: '2026-10-18',
    dependencies: ['PostgreSQL Schema Migration'],
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'All patient consultation records and diagnostic logs must use AES-256 column-level encryption.',
    pageNumber: 1,
    section: 'Data Persistence Architecture'
  });

  await Task.create({
    projectId: pId,
    title: 'Stripe Payment Gateway Integration',
    description: 'Build checkout session API, webhook handlers for invoice payment success, and recurring doctor subscription tiers.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Alex Rivers',
    deadline: '2026-11-15',
    dependencies: ['HIPAA AES-256 Field Encryption'],
    sourceDocumentId: doc3Id,
    sourceDocumentName: 'Client_Direct_Approval.docx',
    sourceExcerpt: 'Stripe has been approved as the payment provider for all clinics. The team is authorized to proceed with live checkout integrations immediately.',
    pageNumber: 1,
    section: 'Formal Approval'
  });

  await Task.create({
    projectId: pId,
    title: 'E-Prescription SureScripts Bridge',
    description: 'Connect EHR system with national pharmacy fulfillment networks via SureScripts API.',
    status: 'Not Started',
    priority: 'Medium',
    assignee: 'Elena Rostova',
    deadline: '2026-12-01',
    dependencies: ['Stripe Payment Gateway Integration'],
    sourceDocumentId: doc1Id,
    sourceDocumentName: 'Sprint_24_Meeting_Notes.txt',
    sourceExcerpt: 'Elena noted that we still lack sandbox API credentials for the external pharmacy bridge.',
    pageNumber: 1,
    section: 'Meeting Summary'
  });

  await Task.create({
    projectId: pId,
    title: 'Automated Patient SMS Reminders',
    description: 'Configure automated SMS notifications for upcoming teleconsultations and follow-ups.',
    status: 'Not Started',
    priority: 'Low',
    assignee: 'Unassigned',
    deadline: '2026-12-10',
    dependencies: [],
    sourceDocumentId: doc2Id,
    sourceDocumentName: 'Project_Tasks_Backlog.csv',
    sourceExcerpt: 'TSK-105, Automated Patient SMS Reminders, Unassigned, Low, Not Started, 2026-12-10',
    pageNumber: 1,
    section: 'Active Sprint Tasks'
  });

  // Decisions
  await Decision.create({
    projectId: pId,
    title: 'Adopt Stripe as Primary Healthcare Payment Provider',
    description: 'Official selection of Stripe for processing patient co-pays and clinic subscriptions.',
    reason: 'Client audit confirmed Stripe Business Associate Agreement (BAA) meets HIPAA compliance standards, and provides native webhook redundancy.',
    decisionDate: '2026-10-28',
    decisionMaker: 'Dr. Robert Harrison (CMIO) & Security Audit Committee',
    sourceDocumentId: doc3Id,
    sourceDocumentName: 'Client_Direct_Approval.docx',
    sourceExcerpt: 'Following our review with the compliance and financial audit committee, Stripe has been approved as the payment provider for all clinics.',
    pageNumber: 1,
    whyMadeExcerpts: [
      'Sprint_24_Meeting_Notes: "Payment integration is blocked until the client confirms the provider. Dr. Harrison expressed security concerns."',
      'Client_Direct_Approval: "Dr. Harrison confirmed the Business Associate Agreement (BAA) meets our strict HIPAA guidelines."'
    ]
  });

  await Decision.create({
    projectId: pId,
    title: 'Transition Core Storage from MongoDB to PostgreSQL',
    description: 'Architectural shift to relational schema for transactional patient records.',
    reason: 'ACID transactional guarantees required for healthcare billing and consultation audit logs.',
    decisionDate: '2026-10-05',
    decisionMaker: 'Sarah Chen (Data Architect)',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'Database migration to PostgreSQL completed on Oct 10, 2026, retiring legacy MongoDB storage to ensure ACID isolation for billing transactions.',
    pageNumber: 1,
    whyMadeExcerpts: [
      'Architecture_Handoff_Spec: "Ensure ACID isolation for billing transactions and strict patient relational integrity."'
    ]
  });

  // Issues & Blockers
  await Issue.create({
    projectId: pId,
    title: 'Payment Integration Stalled on Vendor Sign-Off (RESOLVED)',
    description: 'Sprint 24 identified blocker waiting for executive approval on payment gateway vendor.',
    severity: 'High',
    status: 'Resolved',
    detectedDate: '2026-10-24',
    relatedTask: 'Stripe Payment Gateway Integration',
    suggestedAction: 'Blocker resolved via Client_Direct_Approval.docx. Proceed directly with Stripe API checkout implementation.',
    sourceDocumentId: doc1Id,
    sourceDocumentName: 'Sprint_24_Meeting_Notes.txt',
    sourceExcerpt: 'Payment integration is blocked until the client confirms the provider.',
    pageNumber: 1
  });

  await Issue.create({
    projectId: pId,
    title: 'Missing SureScripts Sandbox API Credentials',
    description: 'Development of E-Prescription module cannot begin until clinic IT administrator grants sandbox credentials.',
    severity: 'Medium',
    status: 'Open',
    detectedDate: '2026-10-24',
    relatedTask: 'E-Prescription SureScripts Bridge',
    suggestedAction: 'Contact Dr. Harrison and IT operations lead to obtain OAuth keys before sprint 26 kickoff.',
    sourceDocumentId: doc1Id,
    sourceDocumentName: 'Sprint_24_Meeting_Notes.txt',
    sourceExcerpt: 'Elena noted that we still lack sandbox API credentials for the external pharmacy bridge.',
    pageNumber: 1
  });

  // Milestones
  await Milestone.create({
    projectId: pId,
    title: 'Core Data Engine & PostgreSQL Migration',
    description: 'Relational data migration and schema validation completed.',
    milestoneDate: '2026-10-10',
    status: 'Completed',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf'
  });

  await Milestone.create({
    projectId: pId,
    title: 'HIPAA Security & KMS Key Validation',
    description: 'Audited AES-256 encryption across all consultation and diagnostic tables.',
    milestoneDate: '2026-10-18',
    status: 'Completed',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf'
  });

  await Milestone.create({
    projectId: pId,
    title: 'Stripe Payment Live Checkout Release',
    description: 'Production release of patient co-pay checkout and clinic billing.',
    milestoneDate: '2026-11-15',
    status: 'Upcoming',
    sourceDocumentId: doc3Id,
    sourceDocumentName: 'Client_Direct_Approval.docx'
  });

  await Milestone.create({
    projectId: pId,
    title: 'E-Prescription Module Beta Launch',
    description: 'End-to-end electronic prescription fulfillment network connection.',
    milestoneDate: '2026-12-01',
    status: 'Upcoming',
    sourceDocumentId: doc1Id,
    sourceDocumentName: 'Sprint_24_Meeting_Notes.txt'
  });

  // Timeline Events
  await TimelineEvent.create({
    projectId: pId,
    title: 'Architectural Shift: PostgreSQL Selected',
    description: 'Decision confirmed to migrate patient medical records to PostgreSQL.',
    eventDate: '2026-10-05',
    eventType: 'Decision',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'Database migration to PostgreSQL completed on Oct 10, 2026.',
    relatedTask: 'PostgreSQL Schema Migration',
    aiExplanation: 'The team selected PostgreSQL over MongoDB to ensure ACID compliance for medical transactions.'
  });

  await TimelineEvent.create({
    projectId: pId,
    title: 'Database Migration Completed',
    description: 'All patient records successfully transferred and verified in PostgreSQL.',
    eventDate: '2026-10-10',
    eventType: 'Milestone',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'Database migration to PostgreSQL completed on Oct 10, 2026.',
    relatedTask: 'PostgreSQL Schema Migration',
    aiExplanation: 'Core data foundation established on schedule.'
  });

  await TimelineEvent.create({
    projectId: pId,
    title: 'HIPAA Audit & Field Encryption Verified',
    description: 'Column encryption implemented with AWS KMS key envelope encryption.',
    eventDate: '2026-10-18',
    eventType: 'Task Completed',
    sourceDocumentId: doc4Id,
    sourceDocumentName: 'Architecture_Handoff_Spec.pdf',
    sourceExcerpt: 'All patient consultation records and diagnostic logs must use AES-256 column-level encryption.',
    relatedTask: 'HIPAA AES-256 Field Encryption',
    aiExplanation: 'Mandatory healthcare regulatory compliance gate passed.'
  });

  await TimelineEvent.create({
    projectId: pId,
    title: 'Payment Integration Blocked in Sprint 24',
    description: 'Sprint meeting recorded a blocker due to unconfirmed payment vendor.',
    eventDate: '2026-10-24',
    eventType: 'Blocker Raised',
    sourceDocumentId: doc1Id,
    sourceDocumentName: 'Sprint_24_Meeting_Notes.txt',
    sourceExcerpt: 'Payment integration is blocked until the client confirms the provider.',
    relatedTask: 'Stripe Payment Gateway Integration',
    aiExplanation: 'Engineers paused gateway work pending vendor selection by client leadership.'
  });

  await TimelineEvent.create({
    projectId: pId,
    title: 'Client Memo: Stripe Officially Approved & Blocker Resolved',
    description: 'Dr. Robert Harrison transmitted formal approval for Stripe.',
    eventDate: '2026-10-28',
    eventType: 'Blocker Resolved',
    sourceDocumentId: doc3Id,
    sourceDocumentName: 'Client_Direct_Approval.docx',
    sourceExcerpt: 'Stripe has been approved as the payment provider for all clinics.',
    relatedTask: 'Stripe Payment Gateway Integration',
    aiExplanation: 'Cross-document reasoning connects Client Memo (Oct 28) with Sprint Notes (Oct 24), identifying that the payment blocker is now fully resolved.'
  });

  await TimelineEvent.create({
    projectId: pId,
    title: 'Target Deadline: Stripe Payment Gateway Launch',
    description: 'Target go-live date for Stripe checkout and webhooks.',
    eventDate: '2026-11-15',
    eventType: 'Milestone',
    sourceDocumentId: doc3Id,
    sourceDocumentName: 'Client_Direct_Approval.docx',
    sourceExcerpt: 'Please ensure readiness for launch on or before November 15, 2026.',
    relatedTask: 'Stripe Payment Gateway Integration',
    aiExplanation: 'Upcoming hard client deadline.'
  });

  // AI Insights: Context Connections & Conflicts
  await AIInsight.create({
    projectId: pId,
    insightType: 'ContextConnection',
    content: 'Payment Blocker Resolution & Immediate Actionability',
    confidence: 96,
    evidenceChain: {
      evidence: 'Sprint_24_Meeting_Notes (Oct 24): "Payment integration is blocked until client confirms provider." vs Client_Direct_Approval (Oct 28): "Stripe has been approved as the payment provider for all clinics."',
      interpretation: 'The latest executive communication directly resolves the sprint blocker. The team can resume payment engineering without further approvals.',
      currentContext: 'Payment integration is currently actionable. Assignee Alex Rivers is targeting Nov 15 for launch.',
      actionableStep: 'Execute Stripe API webhook endpoints and configure development sandbox keys.'
    },
    sourceReferences: [
      { documentId: doc1Id, documentName: 'Sprint_24_Meeting_Notes.txt', page: 1, section: 'Meeting Summary', excerpt: 'Payment integration is blocked until the client confirms the provider.' },
      { documentId: doc3Id, documentName: 'Client_Direct_Approval.docx', page: 1, section: 'Formal Approval', excerpt: 'Stripe has been approved as the payment provider for all clinics.' }
    ]
  });

  await AIInsight.create({
    projectId: pId,
    insightType: 'Conflict',
    content: 'Status Discrepancy: Sprint Notes vs Client Direct Authorization',
    confidence: 94,
    conflictDetails: {
      conflictType: 'Task Status & Blocker Divergence',
      description: 'Document 1 (Sprint 24 Notes) classifies Payment Integration as strictly "Blocked", whereas Document 3 (Client Approval) confirms authorization has been granted.',
      latestResolution: 'Client_Direct_Approval (Oct 28) is chronologically newer than Sprint_24_Meeting_Notes (Oct 24). The newer client update takes precedence.',
      conflictingSources: [
        {
          documentName: 'Sprint_24_Meeting_Notes.txt',
          documentId: doc1Id,
          date: '2026-10-24',
          claim: 'Status: BLOCKED awaiting vendor selection',
          excerpt: 'Payment integration is blocked until the client confirms the provider.'
        },
        {
          documentName: 'Client_Direct_Approval.docx',
          documentId: doc3Id,
          date: '2026-10-28',
          claim: 'Status: APPROVED & AUTHORIZED to proceed',
          excerpt: 'Stripe has been approved as the payment provider for all clinics.'
        }
      ],
      status: 'Reviewed'
    },
    sourceReferences: [
      { documentId: doc1Id, documentName: 'Sprint_24_Meeting_Notes.txt', page: 1, section: 'Blockers', excerpt: 'Payment integration is blocked until the client confirms the provider.' },
      { documentId: doc3Id, documentName: 'Client_Direct_Approval.docx', page: 1, section: 'Formal Approval', excerpt: 'Stripe has been approved as the payment provider for all clinics.' }
    ]
  });

  await AIInsight.create({
    projectId: pId,
    insightType: 'Fact',
    content: 'HIPAA Data Encryption standard is set to AES-256 column-level with AWS KMS key management.',
    confidence: 99,
    sourceReferences: [
      { documentId: doc4Id, documentName: 'Architecture_Handoff_Spec.pdf', page: 1, section: 'Data Persistence Architecture', excerpt: 'All patient consultation records and diagnostic logs must use AES-256 column-level encryption.' }
    ]
  });

  await AIInsight.create({
    projectId: pId,
    insightType: 'Recommendation',
    content: 'Prioritize SureScripts credential acquisition to prevent E-Prescription sprint delays after the Stripe release on Nov 15.',
    confidence: 88,
    evidenceChain: {
      evidence: 'Sprint 24 notes specify lack of sandbox credentials for SureScripts bridge.',
      interpretation: 'Third-party medical API on-boarding normally takes 2-3 weeks; awaiting until December will miss the sprint deadline.',
      currentContext: 'E-Prescription is scheduled for Dec 01 but is currently Not Started.',
      actionableStep: 'Incoming team member should email Dr. Harrison this week for API credentials.'
    },
    sourceReferences: [
      { documentId: doc1Id, documentName: 'Sprint_24_Meeting_Notes.txt', page: 1, section: 'Meeting Summary', excerpt: 'Elena noted that we still lack sandbox API credentials for the external pharmacy bridge.' }
    ]
  });

  return project;
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button, Modal } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { PageLoader } from '@/components/ui/Loader'
import { ErrorState } from '@/components/ui/States'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { formatDate } from '@/utils/formatters'
import { slugify } from '@/utils/formatters'
import { careersService, type JobApplicationRecord } from '@/services/careersService'
import { contactService, type ContactMessageRecord } from '@/services/contactService'
import { caseStudyService, testimonialService } from '@/services/contentService'
import { teamService } from '@/services/teamService'
import { adminService } from '@/services/adminService'
import { useFetch } from '@/hooks/useFetch'
import { getApiErrorMessage } from '@/utils/apiError'
import { CONTACT_EMAIL } from '@/config/socialLinks'
import type { Job, CaseStudy, Testimonial, TeamMember } from '@/types'

// ---------------------------------------------------------------------------
// Careers (Jobs)
// ---------------------------------------------------------------------------
const emptyJobForm = {
  title: '',
  department: '',
  location: 'Remote',
  employmentType: 'full_time',
  experience: '',
  description: '',
  requirements: '',
  responsibilities: '',
}

export function AdminCareersPage() {
  const { data: jobs, isLoading, error, refetch } = useFetch(() => careersService.listAllJobs(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyJobForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = async (job: Job) => {
    await careersService.closeJob(job.id)
    refetch()
  }

  const openModal = () => {
    setForm(emptyJobForm)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    if (!form.title || !form.department || !form.location || !form.experience || !form.description) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createJob({
        title: form.title,
        slug: slugify(form.title),
        department: form.department,
        location: form.location,
        employmentType: form.employmentType,
        experience: form.experience,
        description: form.description,
        requirements: form.requirements.split(',').map((r) => r.trim()).filter(Boolean),
        responsibilities: form.responsibilities.split(',').map((r) => r.trim()).filter(Boolean),
      })
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create the job posting.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<Job>[] = [
    { header: 'Role', render: (j) => <span className="font-medium">{j.title}</span> },
    { header: 'Department', render: (j) => j.department },
    { header: 'Location', render: (j) => j.location },
    { header: 'Status', render: (j) => <Badge tone={j.isOpen ? 'success' : 'neutral'}>{j.isOpen ? 'Open' : 'Closed'}</Badge> },
    { header: 'Posted', render: (j) => formatDate(j.postedAt) },
    {
      header: '',
      render: (j) => (
        <Button size="sm" variant="ghost" onClick={() => handleClose(j)} disabled={!j.isOpen}>
          Close
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Careers</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Open and closed job postings.</p>
        </div>
        <Button size="md" onClick={openModal}>
          <Plus className="size-4" aria-hidden /> New job
        </Button>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={jobs ?? []} keyField={(j) => j.id} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New job posting">
        <div className="flex flex-col gap-4">
          <Input label="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Backend Engineer" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Engineering" />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Employment type</label>
              <select
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <Input label="Experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="2-4 years" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
            />
          </div>
          <Input
            label="Requirements (comma-separated)"
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            placeholder="3+ years Node.js, Experience with REST APIs"
          />
          <Input
            label="Responsibilities (comma-separated)"
            value={form.responsibilities}
            onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
            placeholder="Own backend architecture, Review pull requests"
          />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Post job
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Applications (read-only management)
// ---------------------------------------------------------------------------
const applicationTone = { new: 'primary', reviewed: 'warning', rejected: 'danger', hired: 'success' } as const

export function AdminApplicationsPage() {
  const { data: applications, isLoading, error, refetch } = useFetch(() => careersService.listApplications(), [])

  const columns: DataTableColumn<JobApplicationRecord>[] = [
    { header: 'Applicant', render: (a) => <span className="font-medium">{a.name}</span> },
    { header: 'Email', render: (a) => a.email },
    { header: 'Role', render: (a) => (typeof a.job === 'string' ? a.job : a.job?.title ?? '—') },
    { header: 'Status', render: (a) => <Badge tone={applicationTone[a.status]}>{a.status}</Badge> },
    { header: 'Applied', render: (a) => formatDate(a.createdAt) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Applications</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Candidates who applied through the careers page.</p>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={applications ?? []} keyField={(a) => a.id} emptyTitle="No applications yet" />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Leads (contact form submissions)
// ---------------------------------------------------------------------------
const leadTone = { new: 'primary', contacted: 'warning', closed: 'neutral' } as const

export function AdminLeadsPage() {
  const { data: leads, isLoading, error, refetch } = useFetch(() => contactService.list(), [])

  const handleMarkContacted = async (lead: ContactMessageRecord) => {
    await contactService.updateStatus(lead.id, 'contacted')
    refetch()
  }

  const columns: DataTableColumn<ContactMessageRecord>[] = [
    { header: 'Name', render: (l) => <span className="font-medium">{l.name}</span> },
    { header: 'Email', render: (l) => l.email },
    { header: 'Subject', render: (l) => l.subject },
    { header: 'Status', render: (l) => <Badge tone={leadTone[l.status]}>{l.status}</Badge> },
    { header: 'Received', render: (l) => formatDate(l.createdAt) },
    {
      header: '',
      render: (l) => (
        <Button size="sm" variant="outline" onClick={() => handleMarkContacted(l)} disabled={l.status !== 'new'}>
          Mark contacted
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Leads</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Submissions from the public contact form.</p>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={leads ?? []} keyField={(l) => l.id} emptyTitle="No leads yet" />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Case Studies
// ---------------------------------------------------------------------------
const emptyCaseStudyForm = {
  projectName: '',
  clientIndustry: '',
  problem: '',
  solution: '',
  technologies: '',
  results: '',
}

export function AdminCaseStudiesPage() {
  const { data: items, isLoading, error, refetch } = useFetch(() => caseStudyService.listAll(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyCaseStudyForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setForm(emptyCaseStudyForm)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    if (!form.projectName || !form.clientIndustry || !form.problem || !form.solution) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createCaseStudy({
        projectName: form.projectName,
        slug: slugify(form.projectName),
        clientIndustry: form.clientIndustry,
        problem: form.problem,
        solution: form.solution,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
        results: form.results.split(',').map((r) => r.trim()).filter(Boolean),
      })
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create the case study.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<CaseStudy>[] = [
    { header: 'Project', render: (c) => <span className="font-medium">{c.projectName}</span> },
    { header: 'Industry', render: (c) => c.clientIndustry },
    { header: 'Technologies', render: (c) => c.technologies.slice(0, 3).join(', ') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Case Studies</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Featured work shown on the public site.</p>
        </div>
        <Button size="md" onClick={openModal}>
          <Plus className="size-4" aria-hidden /> New case study
        </Button>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={items ?? []} keyField={(c) => c.id} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New case study">
        <div className="flex flex-col gap-4">
          <Input label="Project name" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} />
          <Input label="Client industry" value={form.clientIndustry} onChange={(e) => setForm({ ...form, clientIndustry: e.target.value })} placeholder="Retail" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Problem</label>
            <textarea rows={2} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Solution</label>
            <textarea rows={2} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
          </div>
          <Input label="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, MongoDB" />
          <Input label="Results (comma-separated)" value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} placeholder="Reduced dispatch time, Removed manual work" />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Create case study
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
const emptyTestimonialForm = { authorName: '', authorRole: '', company: '', quote: '' }

export function AdminTestimonialsPage() {
  const { data: items, isLoading, error, refetch } = useFetch(() => testimonialService.listAll(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyTestimonialForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setForm(emptyTestimonialForm)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    if (!form.authorName || !form.authorRole || !form.company || !form.quote) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createTestimonial(form)
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not create the testimonial.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<Testimonial>[] = [
    { header: 'Author', render: (t) => <span className="font-medium">{t.authorName}</span> },
    { header: 'Company', render: (t) => t.company },
    { header: 'Quote', render: (t) => <span className="line-clamp-1 max-w-xs">{t.quote}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Testimonials</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Client quotes shown on the homepage.</p>
        </div>
        <Button size="md" onClick={openModal}>
          <Plus className="size-4" aria-hidden /> New testimonial
        </Button>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={items ?? []} keyField={(t) => t.id} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New testimonial">
        <div className="flex flex-col gap-4">
          <Input label="Author name" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
          <Input label="Author role" value={form.authorRole} onChange={(e) => setForm({ ...form, authorRole: e.target.value })} placeholder="Operations Lead" />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Quote</label>
            <textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
          </div>
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Create testimonial
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
const emptyTeamForm = { name: '', designation: '', bio: '', linkedinUrl: '', skills: '' }

export function AdminTeamPage() {
  const { data: members, isLoading, error, refetch } = useFetch(() => teamService.listAll(), [])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyTeamForm)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = () => {
    setForm(emptyTeamForm)
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleCreate = async () => {
    if (!form.name || !form.designation || !form.bio) {
      setFormError('Please fill in all required fields.')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    try {
      await adminService.createTeamMember({
        name: form.name,
        designation: form.designation,
        bio: form.bio,
        linkedinUrl: form.linkedinUrl || undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      })
      setIsModalOpen(false)
      refetch()
    } catch (err) {
      setFormError(getApiErrorMessage(err, 'Could not add the team member.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns: DataTableColumn<TeamMember>[] = [
    { header: 'Name', render: (m) => <span className="font-medium">{m.name}</span> },
    { header: 'Designation', render: (m) => m.designation },
    { header: 'Skills', render: (m) => m.skills.slice(0, 3).join(', ') || '—' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Team</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">People shown on the public Team page.</p>
        </div>
        <Button size="md" onClick={openModal}>
          <Plus className="size-4" aria-hidden /> New team member
        </Button>
      </div>
      {isLoading ? <PageLoader /> : error ? <ErrorState onRetry={refetch} /> : (
        <DataTable columns={columns} rows={members ?? []} keyField={(m) => m.id} />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New team member">
        <div className="flex flex-col gap-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
          <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Engineering Lead" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-primary)]">Bio</label>
            <textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40" />
          </div>
          <Input label="LinkedIn URL (optional)" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/..." />
          <Input label="Skills (comma-separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, System Design" />
          {formError && <p className="text-sm text-[var(--color-danger)]">{formError}</p>}
          <Button onClick={handleCreate} isLoading={isSubmitting} className="mt-2">
            Add team member
          </Button>
        </div>
      </Modal>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export function AdminSettingsPage() {
  const [companyName, setCompanyName] = useState('ORBIT-I Private Limited')
  const [supportEmail, setSupportEmail] = useState(CONTACT_EMAIL)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">Settings</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Platform-wide configuration.</p>
      </div>
      <Card hoverable={false} className="max-w-lg">
        <div className="flex flex-col gap-4">
          <Input label="Company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <Input label="Support email" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
          <p className="text-xs text-[var(--color-text-muted)]">
            Not yet persisted to the backend — add a Settings model when this needs to be saved server-side.
          </p>
          <Button className="mt-1 self-start" disabled>Save changes</Button>
        </div>
      </Card>
    </div>
  )
}

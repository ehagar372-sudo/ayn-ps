export type Severity = 'police' | 'medical' | 'suspicious' | 'resolved'

export type IncidentType =
  | 'fight'
  | 'traffic'
  | 'fall'
  | 'suspicious'

export const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  fight: 'خناقة / مشاجرة',
  traffic: 'حادث سير',
  fall: 'شخص أغمى عليه / سقط',
  suspicious: 'حركة مشبوهة',
}

export type Agency = 'interior' | 'ambulance'

export const AGENCY_LABEL: Record<Agency, string> = {
  interior: 'وزارة الداخلية',
  ambulance: 'الإسعاف / المستشفيات',
}

export type BoundingBox = {
  top: string
  right: string
  width: string
  height: string
  label: string
  severity: Severity
}

export type Camera = {
  id: string
  number: string
  location: string
  image: string
  status: 'alert' | 'normal'
  alertLabel?: string
  severity: Severity
  boxes: BoundingBox[]
}

export const CAMERAS: Camera[] = [
  {
    id: 'cam-01',
    number: '01',
    location: 'تقاطع شارع التحرير',
    image: '/cams/cam-01.png',
    status: 'alert',
    alertLabel: 'خناقة',
    severity: 'police',
    boxes: [
      {
        top: '38%',
        right: '22%',
        width: '26%',
        height: '42%',
        label: 'مشاجرة - 94% تأكيد',
        severity: 'police',
      },
    ],
  },
  {
    id: 'cam-04',
    number: '04',
    location: 'ميدان رمسيس',
    image: '/cams/cam-04.png',
    status: 'alert',
    alertLabel: 'حادث سير',
    severity: 'police',
    boxes: [
      {
        top: '44%',
        right: '30%',
        width: '34%',
        height: '32%',
        label: 'تصادم مركبات - 89% تأكيد',
        severity: 'police',
      },
    ],
  },
  {
    id: 'cam-09',
    number: '09',
    location: 'كورنيش النيل',
    image: '/cams/cam-09.png',
    status: 'normal',
    severity: 'resolved',
    boxes: [],
  },
  {
    id: 'cam-12',
    number: '12',
    location: 'محطة القطار',
    image: '/cams/cam-12.png',
    status: 'alert',
    alertLabel: 'شخص سقط',
    severity: 'medical',
    boxes: [
      {
        top: '52%',
        right: '40%',
        width: '28%',
        height: '30%',
        label: 'سقوط شخص - 91% تأكيد',
        severity: 'medical',
      },
    ],
  },
]

export type Alert = {
  id: string
  severity: Severity
  type: IncidentType
  agency: Agency
  title: string
  location: string
  camera: string
  time: string
  confidence: number
  agencyLabel: string
  actions: { label: string; kind: 'confirm' | 'dismiss' | 'stream' }[]
}

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALR-2291',
    severity: 'police',
    type: 'fight',
    agency: 'interior',
    title: 'رصد مشاجرة واستخدام أسلحة بيضاء',
    location: 'شارع التحرير',
    camera: 'الكاميرا 01',
    time: '10:42:15 م',
    confidence: 96,
    agencyLabel: 'إبلاغ أوتوماتيكي: وزارة الداخلية (النجدة)',
    actions: [
      { label: 'تأكيد وإرسال البلاغ', kind: 'confirm' },
      { label: 'تجاهل (بلاغ كاذب)', kind: 'dismiss' },
      { label: 'فتح البث المباشر', kind: 'stream' },
    ],
  },
  {
    id: 'ALR-2290',
    severity: 'medical',
    type: 'fall',
    agency: 'ambulance',
    title: 'رصد سقوط شخص وعدم الحركة (حالة طبية)',
    location: 'محطة القطار',
    camera: 'الكاميرا 12',
    time: '10:40:02 م',
    confidence: 91,
    agencyLabel: 'إبلاغ أوتوماتيكي: هيئة الإسعاف / أقرب مستشفى',
    actions: [
      { label: 'تأكيد البلاغ', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
  {
    id: 'ALR-2289',
    severity: 'police',
    type: 'traffic',
    agency: 'interior',
    title: 'تصادم مركبتين وتعطل حركة المرور',
    location: 'ميدان رمسيس',
    camera: 'الكاميرا 04',
    time: '10:37:48 م',
    confidence: 89,
    agencyLabel: 'إبلاغ أوتوماتيكي: الإدارة العامة للمرور',
    actions: [
      { label: 'تأكيد البلاغ', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
      { label: 'فتح البث', kind: 'stream' },
    ],
  },
  {
    id: 'ALR-2288',
    severity: 'suspicious',
    type: 'suspicious',
    agency: 'interior',
    title: 'تجمع مشبوه بالقرب من مدخل المترو',
    location: 'محطة السادات',
    camera: 'الكاميرا 27',
    time: '10:31:10 م',
    confidence: 74,
    agencyLabel: 'قيد المراجعة اليدوية قبل الإبلاغ',
    actions: [
      { label: 'تأكيد البلاغ', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
]

export const INCOMING_ALERTS: Alert[] = [
  {
    id: 'ALR-2292',
    severity: 'medical',
    type: 'fall',
    agency: 'ambulance',
    title: 'رصد إغماء شخص على الرصيف',
    location: 'شارع قصر العيني',
    camera: 'الكاميرا 18',
    time: '10:44:31 م',
    confidence: 88,
    agencyLabel: 'إبلاغ أوتوماتيكي: هيئة الإسعاف',
    actions: [
      { label: 'تأكيد البلاغ', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
  {
    id: 'ALR-2293',
    severity: 'suspicious',
    type: 'suspicious',
    agency: 'interior',
    title: 'ترك حقيبة دون مراقبة في منطقة الانتظار',
    location: 'محطة القطار',
    camera: 'الكاميرا 12',
    time: '10:46:05 م',
    confidence: 69,
    agencyLabel: 'قيد المراجعة اليدوية قبل الإبلاغ',
    actions: [
      { label: 'تأكيد البلاغ', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
]

export type LogStatus = 'handled' | 'ongoing' | 'filtered'

export const LOG_STATUS_LABEL: Record<LogStatus, string> = {
  handled: 'تم التعامل',
  ongoing: 'جاري المتابعة',
  filtered: 'تم الاستبعاد كبلاغ كاذب',
}

export type LogEntry = {
  id: string
  type: IncidentType
  location: string
  time: string
  agency: string
  status: LogStatus
  aiFiltered?: boolean
}

export const LOGS: LogEntry[] = [
  {
    id: 'INC-58921',
    type: 'fight',
    location: 'شارع التحرير - كاميرا 01',
    time: 'اليوم 10:42 م',
    agency: 'وزارة الداخلية',
    status: 'ongoing',
  },
  {
    id: 'INC-58920',
    type: 'fall',
    location: 'محطة القطار - كاميرا 12',
    time: 'اليوم 10:40 م',
    agency: 'هيئة الإسعاف',
    status: 'ongoing',
  },
  {
    id: 'INC-58919',
    type: 'traffic',
    location: 'ميدان رمسيس - كاميرا 04',
    time: 'اليوم 10:37 م',
    agency: 'الإدارة العامة للمرور',
    status: 'handled',
  },
  {
    id: 'INC-58918',
    type: 'suspicious',
    location: 'كورنيش النيل - كاميرا 09',
    time: 'اليوم 09:58 م',
    agency: '—',
    status: 'filtered',
    aiFiltered: true,
  },
  {
    id: 'INC-58917',
    type: 'fight',
    location: 'شارع الجلاء - كاميرا 22',
    time: 'اليوم 09:21 م',
    agency: 'وزارة الداخلية',
    status: 'handled',
  },
  {
    id: 'INC-58916',
    type: 'fall',
    location: 'ميدان طلعت حرب - كاميرا 07',
    time: 'اليوم 08:47 م',
    agency: '—',
    status: 'filtered',
    aiFiltered: true,
  },
  {
    id: 'INC-58915',
    type: 'traffic',
    location: 'كوبري 6 أكتوبر - كاميرا 31',
    time: 'اليوم 08:12 م',
    agency: 'الإدارة العامة للمرور',
    status: 'handled',
  },
  {
    id: 'INC-58914',
    type: 'suspicious',
    location: 'محطة السادات - كاميرا 27',
    time: 'اليوم 07:33 م',
    agency: '—',
    status: 'filtered',
    aiFiltered: true,
  },
]

export const SEVERITY_CLASS: Record<
  Severity,
  { text: string; bg: string; border: string; ring: string }
> = {
  police: {
    text: 'text-police',
    bg: 'bg-police/15',
    border: 'border-police/60',
    ring: 'shadow-[0_0_20px_-4px_var(--police)]',
  },
  medical: {
    text: 'text-medical',
    bg: 'bg-medical/15',
    border: 'border-medical/60',
    ring: 'shadow-[0_0_20px_-4px_var(--medical)]',
  },
  suspicious: {
    text: 'text-suspicious',
    bg: 'bg-suspicious/15',
    border: 'border-suspicious/60',
    ring: 'shadow-[0_0_20px_-4px_var(--suspicious)]',
  },
  resolved: {
    text: 'text-resolved',
    bg: 'bg-resolved/15',
    border: 'border-resolved/60',
    ring: 'shadow-[0_0_20px_-4px_var(--resolved)]',
  },
}

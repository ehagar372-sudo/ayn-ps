export type Severity = 'police' | 'medical' | 'suspicious' | 'resolved'

export type IncidentType = 'fight' | 'traffic' | 'fall' | 'suspicious'

export const INCIDENT_TYPE_LABEL: Record<IncidentType, string> = {
  fight: 'مشاجرة / خناقة',
  traffic: 'حادث سير',
  fall: 'حالة طبية / سقوط شخص',
  suspicious: 'حركة مشبوهة',
}

export type Agency = 'interior' | 'ambulance'

export const AGENCY_LABEL: Record<Agency, string> = {
  interior: 'وزارة الداخلية / النجدة',
  ambulance: 'هيئة الإسعاف / المستشفيات',
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
    location: 'ميدان التحرير',
    image: '/cams/cam-01.png',
    status: 'alert',
    alertLabel: 'مشاجرة مسلحة',
    severity: 'police',
    boxes: [
      {
        top: '38%',
        right: '22%',
        width: '26%',
        height: '42%',
        label: 'مشاجرة مسلحة - 96%',
        severity: 'police',
      },
    ],
  },
  {
    id: 'cam-08',
    number: '08',
    location: 'محطة قطارات القاهرة',
    image: '/cams/cam-12.png',
    status: 'alert',
    alertLabel: 'سقوط شخص',
    severity: 'medical',
    boxes: [
      {
        top: '52%',
        right: '40%',
        width: '28%',
        height: '30%',
        label: 'سقوط مفاجئ - 92%',
        severity: 'medical',
      },
    ],
  },
  {
    id: 'cam-14',
    number: '14',
    location: 'طريق السويس',
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
        label: 'تصادم مركبات - 89%',
        severity: 'police',
      },
    ],
  },
  {
    id: 'cam-22',
    number: '22',
    location: 'كورنيش النيل',
    image: '/cams/cam-09.png',
    status: 'normal',
    severity: 'resolved',
    boxes: [],
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
  cameraId: string
  time: string
  confidence: number
  agencyLabel: string
  gps: { lat: string; lng: string; district: string }
  actions: { label: string; kind: 'confirm' | 'dismiss' | 'stream' }[]
}

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALR-2291',
    severity: 'police',
    type: 'fight',
    agency: 'interior',
    title: 'مشاجرة واشتباك بالأيدي',
    location: 'ميدان التحرير',
    camera: 'الكاميرا 01',
    cameraId: 'cam-01',
    time: '10:42 م',
    confidence: 96,
    agencyLabel: 'تم التوجيه تلقائياً إلى: وزارة الداخلية (غرفة العمليات المركزية)',
    gps: { lat: '30.0444° N', lng: '31.2357° E', district: 'قسم قصر النيل' },
    actions: [
      { label: 'تأكيد واستدعاء الدوريات', kind: 'confirm' },
      { label: 'استبعاد (بلاغ كاذب)', kind: 'dismiss' },
      { label: 'عرض التسجيل كامل', kind: 'stream' },
    ],
  },
  {
    id: 'ALR-2290',
    severity: 'medical',
    type: 'fall',
    agency: 'ambulance',
    title: 'إغماء / شخص تعبان وسقط أرضاً',
    location: 'محطة القطارات',
    camera: 'الكاميرا 08',
    cameraId: 'cam-08',
    time: '10:40 م',
    confidence: 92,
    agencyLabel: 'تم التوجيه تلقائياً إلى: هيئة الإسعاف المصرية / أسرع مستشفى مجاورة',
    gps: { lat: '30.0626° N', lng: '31.2469° E', district: 'قسم الأزبكية' },
    actions: [
      { label: 'تأكيد البلاغ للإسعاف', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
  {
    id: 'ALR-2289',
    severity: 'police',
    type: 'traffic',
    agency: 'interior',
    title: 'تصادم مركبتين وتعطل حركة المرور',
    location: 'طريق السويس',
    camera: 'الكاميرا 14',
    cameraId: 'cam-14',
    time: '10:37 م',
    confidence: 89,
    agencyLabel: 'تم التوجيه تلقائياً إلى: الإدارة العامة للمرور / النجدة',
    gps: { lat: '30.1018° N', lng: '31.3760° E', district: 'قسم النزهة' },
    actions: [
      { label: 'تأكيد واستدعاء الدوريات', kind: 'confirm' },
      { label: 'استبعاد (بلاغ كاذب)', kind: 'dismiss' },
      { label: 'عرض التسجيل كامل', kind: 'stream' },
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
    cameraId: 'cam-27',
    time: '10:31 م',
    confidence: 74,
    agencyLabel: 'قيد المراجعة اليدوية قبل التوجيه',
    gps: { lat: '30.0442° N', lng: '31.2350° E', district: 'قسم قصر النيل' },
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
    cameraId: 'cam-18',
    time: '10:44 م',
    confidence: 88,
    agencyLabel: 'تم التوجيه تلقائياً إلى: هيئة الإسعاف المصرية',
    gps: { lat: '30.0364° N', lng: '31.2318° E', district: 'قسم السيدة زينب' },
    actions: [
      { label: 'تأكيد البلاغ للإسعاف', kind: 'confirm' },
      { label: 'تجاهل', kind: 'dismiss' },
    ],
  },
  {
    id: 'ALR-2293',
    severity: 'suspicious',
    type: 'suspicious',
    agency: 'interior',
    title: 'ترك حقيبة دون مراقبة في منطقة الانتظار',
    location: 'محطة القطارات',
    camera: 'الكاميرا 08',
    cameraId: 'cam-08',
    time: '10:46 م',
    confidence: 69,
    agencyLabel: 'قيد المراجعة اليدوية قبل التوجيه',
    gps: { lat: '30.0626° N', lng: '31.2469° E', district: 'قسم الأزبكية' },
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
  filtered: 'مستبعد تلقائياً بواسطة AI',
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
  { id: 'INC-58921', type: 'fight', location: 'ميدان التحرير - كاميرا 01', time: 'اليوم 10:42 م', agency: 'وزارة الداخلية', status: 'ongoing' },
  { id: 'INC-58920', type: 'fall', location: 'محطة قطارات القاهرة - كاميرا 08', time: 'اليوم 10:40 م', agency: 'هيئة الإسعاف', status: 'ongoing' },
  { id: 'INC-58919', type: 'traffic', location: 'طريق السويس - كاميرا 14', time: 'اليوم 10:37 م', agency: 'الإدارة العامة للمرور', status: 'handled' },
  { id: 'INC-58918', type: 'suspicious', location: 'كورنيش النيل - كاميرا 22', time: 'اليوم 09:58 م', agency: '—', status: 'filtered', aiFiltered: true },
  { id: 'INC-58917', type: 'fight', location: 'شارع الجلاء - كاميرا 35', time: 'اليوم 09:21 م', agency: 'وزارة الداخلية', status: 'handled' },
  { id: 'INC-58916', type: 'fall', location: 'ميدان طلعت حرب - كاميرا 07', time: 'اليوم 08:47 م', agency: '—', status: 'filtered', aiFiltered: true },
  { id: 'INC-58915', type: 'traffic', location: 'كوبري 6 أكتوبر - كاميرا 31', time: 'اليوم 08:12 م', agency: 'الإدارة العامة للمرور', status: 'handled' },
  { id: 'INC-58914', type: 'suspicious', location: 'محطة السادات - كاميرا 27', time: 'اليوم 07:33 م', agency: '—', status: 'filtered', aiFiltered: true },
]

export const WEEKLY_TREND = [
  { day: 'السبت', before: 42, after: 31 },
  { day: 'الأحد', before: 39, after: 27 },
  { day: 'الإثنين', before: 45, after: 26 },
  { day: 'الثلاثاء', before: 41, after: 22 },
  { day: 'الأربعاء', before: 47, after: 21 },
  { day: 'الخميس', before: 52, after: 19 },
  { day: 'الجمعة', before: 38, after: 14 },
]

export const SEVERITY_CLASS: Record<Severity, { text: string; bg: string; border: string; ring: string }> = {
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

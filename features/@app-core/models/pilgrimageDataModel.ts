export type EntityId = string;
export type IsoDateString = string;
export type IsoDateTimeString = string;
export type UrlString = string;
export type LocaleCode = string;

export type ResourceScope = 'bundle' | 'remote' | 'cache';
export type PublishState = 'draft' | 'published' | 'archived';
export type AssetKind = 'vector-art' | 'image' | 'pdf' | 'audio';
export type AssetTargetType = 'route' | 'day' | 'stop' | 'church' | 'conference' | 'songbook';

export type PilgrimageStopType =
  | 'start'
  | 'church'
  | 'rest'
  | 'meal'
  | 'medical'
  | 'night'
  | 'waypoint'
  | 'mass'
  | 'prayer';

export type PilgrimageNewsCategory =
  | 'announcement'
  | 'logistics'
  | 'spiritual'
  | 'weather'
  | 'quartermaster';

export type QuartermasterCommentPriority = 'info' | 'important' | 'high';
export type PrayerCategory =
  | 'daily'
  | 'litany'
  | 'rosary'
  | 'chaplet'
  | 'song'
  | 'other';

export type SongCategory =
  | 'entrance'
  | 'communion'
  | 'adoration'
  | 'marian'
  | 'pilgrimage'
  | 'praise'
  | 'other';

export type ContentFormat = 'plain-text' | 'markdown' | 'html';

export type BaseEntity = {
  id: EntityId;
  version: number;
  updatedAt: IsoDateTimeString;
  createdAt?: IsoDateTimeString;
  isArchived?: boolean;
};

export type LocalizedText = {
  locale: LocaleCode;
  value: string;
};

export type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

export type MediaAsset = BaseEntity & {
  key: string;
  kind: AssetKind;
  targetType: AssetTargetType;
  title: string;
  fileUrl: UrlString;
  thumbnailUrl?: UrlString;
  mimeType?: string;
};

export type PilgrimageRoute = BaseEntity & {
  code: string;
  name: string;
  year: number;
  startDate: IsoDateString;
  endDate: IsoDateString;
  totalDays: number;
  totalDistanceKm: number;
  defaultLocale: LocaleCode;
  destinationTownName: string;
};

export type PilgrimageDay = BaseEntity & {
  routeId: EntityId;
  dayNumber: number;
  date: IsoDateString;
  title: string;
  subtitle?: string;
  theme?: string;
  distanceKm: number;
  scheduledStartTime?: string;
  plannedArrivalTime?: string;
  startTownName: string;
  endTownName: string;
};

export type DayStop = BaseEntity & {
  dayId: EntityId;
  orderIndex: number;
  type: PilgrimageStopType;
  name: string;
  townName: string;
  description?: string;
  note?: string;
  badge?: string;
  scheduledAt?: IsoDateTimeString;
  durationMin?: number;
  distanceFromStartKm?: number;
  distanceToNextKm?: number;
  location: GeoCoordinate;
  assetKey?: string;
};

export type RoutePathPoint = {
  dayId: EntityId;
  orderIndex: number;
  latitude: number;
  longitude: number;
};

export type Reflection = BaseEntity & {
  dayId: EntityId;
  title: string;
  quote: string;
  reference?: string;
};

export type ConferenceContentBlock =
  | {
      type: 'section';
      title: string;
      body: string;
    }
  | {
      type: 'quote';
      body: string;
      author?: string;
    }
  | {
      type: 'bullet-list';
      title?: string;
      items: string[];
    };

export type Conference = BaseEntity & {
  dayId: EntityId;
  dayNumber: number;
  state: PublishState;
  sectionTitle: string;
  badgeLabel?: string;
  title: string;
  lead?: string;
  summary: string;
  speaker?: string;
  durationMin?: number;
  audioUrl?: UrlString;
  coverAssetKey?: string;
  content: ConferenceContentBlock[];
};

export type NewsItem = BaseEntity & {
  category: PilgrimageNewsCategory;
  title: string;
  summary: string;
  content: string;
  publishedAt: IsoDateTimeString;
  expiresAt?: IsoDateTimeString;
  isPinned: boolean;
  deeplink?: string;
  dayId?: EntityId;
};

export type QuartermasterComment = BaseEntity & {
  dayId?: EntityId;
  title: string;
  content: string;
  priority: QuartermasterCommentPriority;
  publishedAt: IsoDateTimeString;
  expiresAt?: IsoDateTimeString;
  deeplink?: string;
};

export type GroupOrderEntry = {
  position: number;
  groupCode: string;
  groupName: string;
  description?: string;
};

export type GroupOrder = BaseEntity & {
  dayId: EntityId;
  dayNumber: number;
  entries: GroupOrderEntry[];
};

export type Prayer = BaseEntity & {
  slug: string;
  title: string;
  category: PrayerCategory;
  contentFormat: ContentFormat;
  content: string;
  excerpt?: string;
};

export type Songbook = BaseEntity & {
  title: string;
  format: 'pdf' | 'structured';
  coverAssetKey?: string;
  fileUrl?: UrlString;
};

export type Song = BaseEntity & {
  songbookId: EntityId;
  slug: string;
  title: string;
  category: SongCategory;
  lyricsFormat: ContentFormat;
  lyrics: string;
  source?: string;
  orderIndex?: number;
};

export type DashboardToday = {
  day: PilgrimageDay;
  conference?: Pick<
    Conference,
    'id' | 'title' | 'summary' | 'speaker' | 'durationMin' | 'updatedAt' | 'version'
  >;
  groupOrder?: GroupOrder;
  latestNews: Pick<NewsItem, 'id' | 'title' | 'summary' | 'publishedAt' | 'category' | 'isPinned'>[];
  quartermasterComment?: Pick<
    QuartermasterComment,
    'id' | 'title' | 'content' | 'priority' | 'publishedAt'
  >;
  updatedAt: IsoDateTimeString;
};

export type SyncResourceVersion = {
  version: number;
  updatedAt: IsoDateTimeString;
};

export type SyncBootstrap = {
  serverTime: IsoDateTimeString;
  minimumSupportedAppVersion: string;
  syncToken: string;
  resources: {
    routes: SyncResourceVersion;
    days: SyncResourceVersion;
    stops: SyncResourceVersion;
    conferences: SyncResourceVersion;
    news: SyncResourceVersion;
    quartermasterComments: SyncResourceVersion;
    groupOrders: SyncResourceVersion;
    prayers: SyncResourceVersion;
    songbook: SyncResourceVersion;
    songs: SyncResourceVersion;
    assets: SyncResourceVersion;
  };
};

export type CachedEnvelope<T> = {
  scope: ResourceScope;
  syncedAt?: IsoDateTimeString;
  items: T[];
};

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { PrayerHandsIcon, pilgrimageRouteTheme } from '../../../../../packages/@app-ui';
import { pilgrimageDay } from '../../../constants/pilgrimageRoute';

const { colors, typography } = pilgrimageRouteTheme;

type PilgrimageConferenceScreenProps = {
  onBack: () => void;
};

const conferenceMock = {
  badge: 'Tymczasowy mock',
  lead: 'Konferencja dnia 1',
  title: 'Wyrusz z tym, co naprawdę niesiesz',
  subtitle:
    'Rozważanie otwierające pierwszy etap pielgrzymki: o intencji drogi, zgodzie na trud i uczeniu się obecności Boga w prostym rytmie marszu.',
  speaker: 'Ks. przewodnik grupy',
  duration: '20 minut',
  sections: [
    {
      title: 'Punkt wyjścia',
      body:
        'Pierwszy dzień porządkuje serce. Nie chodzi jeszcze o tempo ani o kilometry, ale o uczciwe nazwanie tego, z czym wchodzisz na trasę: wdzięcznością, prośbą, zmęczeniem, lękiem albo pragnieniem nowego początku.',
    },
    {
      title: 'Myśl przewodnia',
      body:
        'Pielgrzymka nie zaczyna się na drodze, tylko w decyzji. Każdy krok ma znaczenie wtedy, gdy jest odpowiedzią na wezwanie, a nie tylko realizacją planu. Bóg prowadzi także przez zwyczajność: śpiew, ciszę, kurz i wysiłek.',
    },
    {
      title: 'Zadanie na dziś',
      body:
        'Wybierz jedną intencję, którą świadomie poniesiesz przez cały dzień. Wracaj do niej na postoju, podczas modlitwy i wtedy, gdy pojawi się znużenie. Nie mnoż tematów. Niech pierwszy dzień ustawi kierunek całej drogi.',
    },
  ],
  quote:
    'Nie musisz mieć wszystkiego poukładanego przed startem. Wystarczy, że zgodzisz się iść.',
  quoteAuthor: 'motyw konferencji dnia 1',
};

function formatConferenceDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function PilgrimageConferenceScreen({ onBack }: PilgrimageConferenceScreenProps) {
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.surface }}
      contentContainerClassName="px-4 pt-6 pb-6"
      showsVerticalScrollIndicator={false}>
      <TouchableOpacity activeOpacity={0.75} onPress={onBack}>
        <Text
          className="mb-5 text-[15px] font-semibold"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          Wróć do Start
        </Text>
      </TouchableOpacity>

      <View
        className="overflow-hidden rounded-[28px] border px-5 py-5"
        style={{ backgroundColor: '#fbf7f2', borderColor: '#ead9c8' }}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <View className="self-start rounded-full px-3 py-[7px]" style={{ backgroundColor: '#f3e3d1' }}>
              <Text
                className="text-[12px] font-bold uppercase tracking-[0.8px]"
                style={{ color: '#8b5b00', fontFamily: typography.fontFamily }}>
                {conferenceMock.badge}
              </Text>
            </View>
            <Text
              className="mt-4 text-[13px] font-extrabold uppercase tracking-[1px]"
              style={{ color: '#9f6a2e', fontFamily: typography.fontFamily }}>
              {conferenceMock.lead}
            </Text>
            <Text
              className="mt-2 text-[28px] font-bold leading-9"
              style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
              {conferenceMock.title}
            </Text>
            <Text
              className="mt-3 text-[15px] leading-6"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {conferenceMock.subtitle}
            </Text>
          </View>

          <View
            className="h-14 w-14 items-center justify-center rounded-[16px]"
            style={{ backgroundColor: '#fff1df' }}>
            <PrayerHandsIcon size={26} color="#9f6a2e" />
          </View>
        </View>

        <View className="mt-5 flex-row flex-wrap gap-2">
          <View className="rounded-full px-3 py-2" style={{ backgroundColor: '#fffaf3' }}>
            <Text
              className="text-[12px] font-medium"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Dzień 1 • {pilgrimageDay.title}
            </Text>
          </View>
          <View className="rounded-full px-3 py-2" style={{ backgroundColor: '#fffaf3' }}>
            <Text
              className="text-[12px] font-medium"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {formatConferenceDate(pilgrimageDay.date)}
            </Text>
          </View>
          <View className="rounded-full px-3 py-2" style={{ backgroundColor: '#fffaf3' }}>
            <Text
              className="text-[12px] font-medium"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              Prowadzi: {conferenceMock.speaker}
            </Text>
          </View>
          <View className="rounded-full px-3 py-2" style={{ backgroundColor: '#fffaf3' }}>
            <Text
              className="text-[12px] font-medium"
              style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
              {conferenceMock.duration}
            </Text>
          </View>
        </View>
      </View>

      <View
        className="mt-5 rounded-[24px] border px-5 py-5"
        style={{ backgroundColor: '#fff', borderColor: '#ece6ea' }}>
        <Text
          className="text-[13px] font-extrabold uppercase tracking-[1px]"
          style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
          O czym jest ta konferencja
        </Text>

        <View className="mt-4 gap-5">
          {conferenceMock.sections.map((section) => (
            <View key={section.title}>
              <Text
                className="text-[18px] font-bold"
                style={{ color: colors.onSurface, fontFamily: typography.fontFamily }}>
                {section.title}
              </Text>
              <Text
                className="mt-2 text-[15px] leading-7"
                style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
                {section.body}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View
        className="mt-5 rounded-[24px] px-5 py-5"
        style={{ backgroundColor: '#f4edf2', borderWidth: 1, borderColor: '#e8dbe3' }}>
        <Text
          className="text-[22px] font-bold leading-8"
          style={{ color: colors.primary, fontFamily: typography.fontFamily }}>
          “{conferenceMock.quote}”
        </Text>
        <Text
          className="mt-3 text-[13px] font-semibold uppercase tracking-[0.8px]"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          {conferenceMock.quoteAuthor}
        </Text>
      </View>

      <View
        className="mt-5 rounded-[24px] border px-5 py-5"
        style={{ backgroundColor: '#fff', borderColor: '#ece6ea' }}>
        <Text
          className="text-[13px] font-extrabold uppercase tracking-[1px]"
          style={{ color: colors.primaryContainer, fontFamily: typography.fontFamily }}>
          Status
        </Text>
        <Text
          className="mt-3 text-[15px] leading-7"
          style={{ color: colors.onSurfaceVariant, fontFamily: typography.fontFamily }}>
          To jest tymczasowy mock ekranu konferencji dla dnia pierwszego, podpięty pod panel Start.
          Docelowo tę sekcję można zasilić danymi z CMS, Firestore albo pliku dziennego.
        </Text>
      </View>
    </ScrollView>
  );
}

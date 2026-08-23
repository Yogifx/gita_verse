import type { ContentItem } from "@/types/content";

export const DAILY_TARGET = 1;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

function fromNow(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

/**
 * Realistic GitaVerse sample data grounded in genuine Bhagavad Gita verses.
 * Structured to match the shape a future content API/database would return —
 * replacing this module is the only change needed to go live.
 */
export const seedContentItems: ContentItem[] = [
  {
    id: "c1",
    title: "Duty Without Attachment",
    format: "reel",
    status: "in_review",
    pipelineStage: "review",
    reference: { chapter: 2, verseLabel: "47", chapterTitle: "Karma Yoga: Action and Its Secret" },
    shloka:
      "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration:
      "karmaṇy-evādhikāraste mā phaleṣu kadācana, mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    meaning:
      "You have the right to perform your duty, but never to the fruits of your actions. Do not act for reward, and never abandon your responsibility.",
    keyLearning:
      "Focus fully on the quality of your effort — release your grip on outcomes you cannot control.",
    platforms: ["instagram", "youtube_shorts"],
    createdAt: ago(2 * DAY),
    updatedAt: ago(1 * HOUR),
    isToday: true,
  },
  {
    id: "c2",
    title: "The Eternal Soul",
    format: "carousel",
    status: "scheduled",
    pipelineStage: "scheduled",
    reference: { chapter: 2, verseLabel: "20", chapterTitle: "Sankhya Yoga: The Eternal Reality of the Soul's Immortality" },
    shloka:
      "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः। अजो नित्यः शाश्वतोयं पुराणो न हन्यते हन्यमाने शरीरे॥",
    transliteration:
      "na jāyate mriyate vā kadācin nāyaṁ bhūtvā bhavitā vā na bhūyaḥ, ajo nityaḥ śāśvato 'yaṁ purāṇo na hanyate hanyamāne śarīre",
    meaning:
      "The soul is never born and never dies. It is eternal, ever-existing, and undying — the body perishes, but the soul remains.",
    keyLearning:
      "Your truest identity is not the body — grief and fear lose their grip when you remember what is truly permanent.",
    platforms: ["instagram", "facebook", "linkedin"],
    createdAt: ago(3 * DAY),
    updatedAt: ago(1 * DAY),
    scheduledFor: fromNow(1 * DAY),
  },
  {
    id: "c3",
    title: "Master Your Own Mind",
    format: "post",
    status: "approved",
    pipelineStage: "approved",
    reference: { chapter: 6, verseLabel: "5", chapterTitle: "Dhyana Yoga: The Practice of Meditation" },
    shloka:
      "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    transliteration:
      "uddhared ātmanātmānaṁ nātmānam avasādayet, ātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
    meaning:
      "Lift yourself by your own effort; do not let yourself sink. The mind alone is your best friend — or your worst enemy.",
    keyLearning:
      "Self-discipline is self-friendship. You decide whether your mind serves you or sabotages you.",
    platforms: ["linkedin", "facebook"],
    createdAt: ago(4 * DAY),
    updatedAt: ago(1 * DAY - 3 * HOUR),
  },
  {
    id: "c4",
    title: "The Qualities of a Devoted Soul",
    format: "reel",
    status: "ai_generated",
    pipelineStage: "design",
    reference: { chapter: 12, verseLabel: "13–14", chapterTitle: "Bhakti Yoga: The Yoga of Devotion" },
    shloka:
      "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च। निर्ममो निरहङ्कारः समदुःखसुखः क्षमी॥",
    transliteration:
      "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca, nirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
    meaning:
      "One who bears ill will toward no one, who is friendly and compassionate, free of possessiveness and ego, equal in joy and sorrow, and forgiving — is dear.",
    keyLearning:
      "Spiritual maturity looks like steadiness: kindness without exception, and equanimity through comfort and hardship alike.",
    platforms: ["youtube_shorts", "instagram"],
    createdAt: ago(5 * DAY),
    updatedAt: ago(5 * HOUR),
  },
  {
    id: "c5",
    title: "Walk Your Own Path",
    format: "carousel",
    status: "draft",
    pipelineStage: "script",
    reference: { chapter: 3, verseLabel: "35", chapterTitle: "Karma Yoga: Action and Its Secret" },
    shloka:
      "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्। स्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥",
    transliteration:
      "śreyān sva-dharmo viguṇaḥ para-dharmāt svanuṣṭhitāt, sva-dharme nidhanaṁ śreyaḥ para-dharmo bhayāvahaḥ",
    meaning:
      "It is better to imperfectly follow your own path than to perfectly imitate another's. Better to fail walking your own road than to succeed on someone else's.",
    keyLearning:
      "Comparison is a trap. Growth comes from honoring your own nature and responsibilities, not copying someone else's path.",
    platforms: ["instagram"],
    createdAt: ago(6 * DAY),
    updatedAt: ago(2 * DAY),
  },
  {
    id: "c6",
    title: "Surrender Your Fear",
    format: "post",
    status: "in_review",
    pipelineStage: "review",
    reference: { chapter: 18, verseLabel: "66", chapterTitle: "Moksha Sanyasa Yoga: The Perfection of Renunciation" },
    shloka:
      "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration:
      "sarva-dharmān parityajya māmekaṁ śaraṇaṁ vraja, ahaṁ tvā sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    meaning:
      "Abandon all fear, and come to me alone for shelter. I will free you from every burden — do not grieve.",
    keyLearning:
      "Real courage is trusting a bigger process than your own anxious control — surrender is not weakness, it's release.",
    platforms: ["facebook", "linkedin"],
    createdAt: ago(4 * DAY),
    updatedAt: ago(3 * HOUR),
  },
  {
    id: "c7",
    title: "How Anger Clouds the Mind",
    format: "reel",
    status: "published",
    pipelineStage: "published",
    reference: { chapter: 2, verseLabel: "62–63", chapterTitle: "Sankhya Yoga: The Eternal Reality of the Soul's Immortality" },
    shloka:
      "क्रोधात्भवति संमोहः संमोहात्स्मृतिविभ्रमः। स्मृतिभ्रंशाद्बुद्धिनाशो बुद्धिनाशात्प्रणश्यति॥",
    transliteration:
      "krodhāt bhavati saṁmohaḥ saṁmohāt smṛti-vibhramaḥ, smṛti-bhraṁśād buddhi-nāśo buddhi-nāśāt praṇaśyati",
    meaning:
      "From anger comes delusion, from delusion comes loss of memory, from loss of memory comes destruction of intellect, and from that, one falls entirely.",
    keyLearning:
      "Anger clouds judgment in stages — catch it early, before it snowballs into decisions you'll regret.",
    platforms: ["instagram", "youtube_shorts"],
    createdAt: ago(8 * DAY),
    updatedAt: ago(4 * DAY),
    publishedAt: ago(4 * DAY),
    publishedThisWeek: true,
  },
  {
    id: "c8",
    title: "Why Balance Restores Itself",
    format: "post",
    status: "published",
    pipelineStage: "published",
    reference: { chapter: 4, verseLabel: "7–8", chapterTitle: "Jnana Yoga: Transcendental Knowledge" },
    shloka:
      "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration:
      "yadā yadā hi dharmasya glānir bhavati bhārata, abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
    meaning:
      "Whenever righteousness declines and unrighteousness rises, I manifest myself, Arjuna.",
    keyLearning:
      "Balance is self-correcting at every scale — when things drift too far off course, forces rise to restore order.",
    platforms: ["linkedin"],
    createdAt: ago(9 * DAY),
    updatedAt: ago(5 * DAY),
    publishedAt: ago(5 * DAY),
    publishedThisWeek: true,
  },
  {
    id: "c9",
    title: "Consistency Is Rewarded",
    format: "carousel",
    status: "draft",
    pipelineStage: "idea",
    reference: { chapter: 9, verseLabel: "22", chapterTitle: "Raja Vidya Guhya Yoga: The Most Confidential Knowledge" },
    shloka:
      "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    transliteration:
      "ananyāś cintayanto māṁ ye janāḥ paryupāsate, teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    meaning:
      "For those who worship me with single-minded devotion, I carry what they lack and preserve what they have.",
    keyLearning:
      "Consistent, sincere focus is met with support. Show up steadily, and provision follows.",
    platforms: ["instagram", "facebook"],
    createdAt: ago(2 * DAY),
    updatedAt: ago(2 * DAY),
  },
  {
    id: "c10",
    title: "Untouched Like a Lotus Leaf",
    format: "reel",
    status: "draft",
    pipelineStage: "research",
    reference: { chapter: 5, verseLabel: "10", chapterTitle: "Karma Sanyasa Yoga: Action and Renunciation" },
    shloka:
      "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः। लिप्यते न स पापेन पद्मपत्रमिवाम्भसा॥",
    transliteration:
      "brahmaṇy ādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ, lipyate na sa pāpena padma-patram ivāmbhasā",
    meaning:
      "One who acts without attachment, offering the results to the divine, remains untouched by wrongdoing — like a lotus leaf untouched by water.",
    keyLearning:
      "You can be fully engaged in action and still remain inwardly unstained — presence without clinging is the goal.",
    platforms: ["youtube_shorts"],
    createdAt: ago(4 * DAY),
    updatedAt: ago(3 * DAY),
  },
  {
    id: "c11",
    title: "A Fragment of the Divine",
    format: "carousel",
    status: "published",
    pipelineStage: "published",
    reference: { chapter: 15, verseLabel: "7", chapterTitle: "Purushottama Yoga: The Supreme Divine Personality" },
    shloka:
      "ममैवांशो जीवलोके जीवभूतः सनातनः। मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥",
    transliteration:
      "mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ, manaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
    meaning:
      "The eternal living being in this world is a fragment of me, struggling with the mind and five senses rooted in nature.",
    keyLearning:
      "You carry something eternal within you — the daily struggle with mind and senses is part of a much larger identity.",
    platforms: ["instagram", "facebook", "linkedin"],
    createdAt: ago(10 * DAY),
    updatedAt: ago(6 * DAY),
    publishedAt: ago(6 * DAY),
    publishedThisWeek: true,
  },
];

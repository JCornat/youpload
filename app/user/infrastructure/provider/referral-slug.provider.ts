import { ReferralProvider } from '@user/domain/provider/referral.provider.ts';

const words = [
  'abandoned',
  'abiding',
  'ability',
  'able',
  'abnormal',
  'abrasive',
  'absurd',
  'abundant',
  'acceptable',
  'accident',
  'account',
  'accountant',
  'acidic',
  'acoustic',
  'acrid',
  'action',
  'activity',
  'actor',
  'ad',
  'adamant',
  'addition',
  'address',
  'adorable',
  'adult',
  'advantage',
  'adventurous',
  'advertisement',
  'afternoon',
  'agency',
  'agent',
  'aggressive',
  'agitated',
  'agreeable',
  'air',
  'airline',
  'airplane',
  'airport',
  'alarm',
  'alert',
  'alive',
  'alligator',
  'aloof',
  'ambitious',
  'ambulance',
  'analyst',
  'ancient',
  'angle',
  'angry',
  'animal',
  'annoyed',
  'answer',
  'antsy',
  'anxious',
  'apartment',
  'appalling',
  'appetizing',
  'apple',
  'application',
  'appointment',
  'apprehensive',
  'architect',
  'area',
  'argument',
  'arm',
  'army',
  'arrogant',
  'art',
  'article',
  'artist',
  'ashamed',
  'astonishing',
  'attractive',
  'australia',
  'author',
  'autumn',
  'average',
  'baby',
  'bad',
  'baker',
  'bald',
  'balloon',
  'banana',
  'barista',
  'bashful',
  'battery',
  'beach',
  'bear',
  'beard',
  'beautiful',
  'bed',
  'beefy',
  'belgium',
  'belligerent',
  'bent',
  'best',
  'better',
  'bewildered',
  'big',
  'billions',
  'billowy',
  'bird',
  'bit',
  'bitter',
  'black',
  'bland',
  'blue',
  'blushing',
  'book',
  'boots',
  'bored',
  'boring',
  'boundless',
  'boy',
  'brainy',
  'branch',
  'brash',
  'brave',
  'breakfast',
  'breezy',
  'brief',
  'bright',
  'broad',
  'broken',
  'brother',
  'brown',
  'bulky',
  'bumpy',
  'burly',
  'businessperson',
  'busy',
  'butcher',
  'byte',
  'cagey',
  'callous',
  'calm',
  'camera',
  'candle',
  'car',
  'caravan',
  'careful',
  'carpenter',
  'carpet',
  'cartoon',
  'cat',
  'chef',
  'child',
  'chilly',
  'china',
  'chubby',
  'church',
  'city',
  'clean',
  'clever',
  'clumsy',
  'coat',
  'coffeeshop',
  'cold',
  'colossal',
  'computer',
  'continent',
  'controller',
  'cool',
  'country',
  'cpu',
  'crashing',
  'crayon',
  'creamy',
  'cricket',
  'crooked',
  'crowd',
  'cuddly',
  'curved',
  'damaged',
  'damp',
  'daughter',
  'dawn',
  'daybreak',
  'dazzling',
  'dead',
  'deafening',
  'death',
  'deep',
  'defeated',
  'delicious',
  'delightful',
  'denmark',
  'dentist',
  'diamond',
  'dinner',
  'dirty',
  'disease',
  'disgusting',
  'doctor',
  'dog',
  'drab',
  'dream',
  'dress',
  'dry',
  'dusk',
  'eager',
  'early',
  'easter',
  'easy',
  'echoing',
  'egg',
  'eggplant',
  'egypt',
  'electrician',
  'elegant',
  'elephant',
  'embarrassed',
  'energy',
  'engine',
  'engineer',
  'england',
  'enough',
  'eve',
  'evening',
  'eventide',
  'exabyte',
  'eye',
  'faint',
  'faithful',
  'fall',
  'family',
  'famous',
  'fancy',
  'farmer',
  'fast',
  'fat',
  'father',
  'few',
  'fierce',
  'finland',
  'fireman',
  'fish',
  'fit',
  'flabby',
  'flag',
  'flaky',
  'flat',
  'florist',
  'flower',
  'fluffy',
  'football',
  'forest',
  'fountain',
  'france',
  'freezing',
  'fresh',
  'full',
  'furniture',
  'future',
  'garage',
  'garden',
  'gas',
  'gentle',
  'ghost',
  'gifted',
  'gigabyte',
  'gigantic',
  'girl',
  'glamorous',
  'glass',
  'gold',
  'gorgeous',
  'gpu',
  'grandmother',
  'grass',
  'gray',
  'greasy',
  'great',
  'greece',
  'green',
  'grumpy',
  'guitar',
  'hair',
  'hairdresser',
  'hallowed',
  'hamburger',
  'handsome',
  'happy',
  'harsh',
  'helicopter',
  'helmet',
  'helpful',
  'helpless',
  'high',
  'hissing',
  'holiday',
  'hollow',
  'honey',
  'horse',
  'hospital',
  'hot',
  'house',
  'howling',
  'huge',
  'hundreds',
  'hydrogen',
  'ice',
  'icy',
  'immense',
  'important',
  'incalculable',
  'inexpensive',
  'insect',
  'insurance',
  'intern',
  'iron',
  'island',
  'itchy',
  'jackal',
  'jealous',
  'jelly',
  'jewellery',
  'jolly',
  'jordan',
  'journalist',
  'joystick',
  'judge',
  'juice',
  'juicy',
  'kangaroo',
  'keyboard',
  'kilobyte',
  'kind',
  'king',
  'kitchen',
  'kite',
  'knife',
  'lamp',
  'laptop',
  'large',
  'late',
  'lawyer',
  'lazy',
  'leather',
  'lemon',
  'librarian',
  'library',
  'lifeguard',
  'lighter',
  'limited',
  'lion',
  'little',
  'lively',
  'lizard',
  'lock',
  'london',
  'long',
  'loose',
  'loud',
  'low',
  'lunch',
  'machine',
  'magazine',
  'magician',
  'magnificent',
  'mammoth',
  'man',
  'manchester',
  'mango',
  'many',
  'market',
  'massive',
  'match',
  'mealy',
  'mechanic',
  'megabyte',
  'melodic',
  'melted',
  'memory',
  'microphone',
  'microscopic',
  'midnight',
  'millions',
  'miniature',
  'minister',
  'modern',
  'moldy',
  'monitor',
  'monkey',
  'morn',
  'morning',
  'most',
  'mother',
  'motherboard',
  'motorcycle',
  'mouse',
  'muscular',
  'mushy',
  'musician',
  'mysterious',
  'nail',
  'napkin',
  'narrow',
  'needle',
  'nervous',
  'nest',
  'nice',
  'nigeria',
  'night',
  'nightfall',
  'noisy',
  'noon',
  'notebook',
  'numerous',
  'nurse',
  'nutritious',
  'nutty',
  'obedient',
  'obnoxious',
  'ocean',
  'odd',
  'oil',
  'old',
  'optician',
  'orange',
  'orange',
  'oxygen',
  'oyster',
  'pager',
  'painter',
  'painting',
  'panicky',
  'park',
  'parrot',
  'pencil',
  'petabyte',
  'petite',
  'pharmacist',
  'photographer',
  'piano',
  'pillow',
  'pilot',
  'pitiful',
  'pizza',
  'plain',
  'planet',
  'plastic',
  'plumber',
  'plump',
  'policeman',
  'polite',
  'poor',
  'portugal',
  'postman',
  'potato',
  'powerful',
  'prehistoric',
  'prickly',
  'printer',
  'processor',
  'proud',
  'psychiatrist',
  'puny',
  'purple',
  'purring',
  'putrid',
  'quaint',
  'queen',
  'quick',
  'quiet',
  'quill',
  'rain',
  'rainbow',
  'raincoat',
  'ram',
  'rancid',
  'rapid',
  'rapping',
  'raspy',
  'receptionist',
  'red',
  'refined',
  'refrigerator',
  'repulsive',
  'restaurant',
  'rhythmic',
  'rich',
  'ripe',
  'river',
  'rocket',
  'room',
  'rose',
  'rotten',
  'rough',
  'round',
  'russia',
  'salesclerk',
  'salesmen',
  'salmon',
  'salty',
  'sandwich',
  'savory',
  'scarce',
  'scary',
  'school',
  'scientist',
  'scooter',
  'scrawny',
  'screeching',
  'scruffy',
  'secretary',
  'shaggy',
  'shallow',
  'shampoo',
  'shapely',
  'sharp',
  'shoe',
  'short',
  'shrilling',
  'shy',
  'silly',
  'skinny',
  'slimy',
  'slow',
  'small',
  'smartphone',
  'soccer',
  'solstice',
  'some',
  'sour',
  'sparse',
  'spicy',
  'spoiled',
  'spoon',
  'spring',
  'square',
  'squeaking',
  'stale',
  'state',
  'steep',
  'sticky',
  'stocky',
  'stone',
  'straight',
  'strong',
  'student',
  'substantial',
  'sugar',
  'summer',
  'sundown',
  'sunset',
  'sweden',
  'sweet',
  'swift',
  'table',
  'tailor',
  'tall',
  'tangy',
  'tart',
  'tasteless',
  'tasty',
  'teacher',
  'teenager',
  'teeny',
  'telephone',
  'television',
  'tender',
  'tent',
  'terabyte',
  'thailand',
  'thankful',
  'thoughtless',
  'thousands',
  'thundering',
  'tiger',
  'tight',
  'tinkling',
  'tiny',
  'toddler',
  'tomato',
  'toothbrush',
  'traffic',
  'train',
  'translator',
  'truck',
  'twilight',
  'uganda',
  'ugly',
  'umbrella',
  'uneven',
  'unimportant',
  'uninterested',
  'unkempt',
  'unsightly',
  'uptight',
  'van',
  'vase',
  'vast',
  'vegetable',
  'victorious',
  'vr',
  'vulture',
  'wailing',
  'waiter',
  'waitress',
  'wall',
  'warm',
  'weak',
  'wet',
  'whale',
  'whining',
  'whispering',
  'white',
  'wide',
  'window',
  'winter',
  'wire',
  'witty',
  'wolf',
  'woman',
  'wonderful',
  'wooden',
  'worried',
  'wrong',
  'xylophone',
  'yacht',
  'yak',
  'yellow',
  'yottabyte',
  'young',
  'yummy',
  'zealous',
  'zebra',
  'zettabyte',
  'zoo',
];

export class ReferralSlugProvider implements ReferralProvider {
  async generate(): Promise<string> {
    const min = 0;
    const max = words.length;
    const random1 = this.getRandomArbitrary(min, max);
    const random2 = this.getRandomArbitrary(min, max);
    const random3 = this.getRandomArbitrary(min, max);
    return [words[random1], words[random2], words[random3]].join('-');
  }

  private getRandomArbitrary(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }
}

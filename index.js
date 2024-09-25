class Rule {
    _toReplace;
    _replacement;
    _prefix;
    _suffix;

    constructor(rule, charGroups) {
        const [strings, match] = rule.split(/\s+\/\s+/u);
        [this._toReplace, this._replacement] = strings.split(/\s+->\s+/u);
        [this._prefix, this._suffix] = match.split(/\s?_\s?/u);
        for(const [key, value] of Object.entries(charGroups)) {
            const charGroupRegex = new RegExp(key, 'gu');
            this._prefix = this._prefix.replace(charGroupRegex, value)
                .replace(/#/u, '^');
            this._suffix = this._suffix 
                ? this._suffix
                    .replace(charGroupRegex, value).replace(/#/u, '$') 
                : '';
        }
        this._replacement = this._replacement.replace(/0/u, '');
    }

    get regex() {
        return new RegExp(`(${this._prefix})(${this._toReplace})(${this._suffix})`, 'u');
    }
}

const charGroups = {
    '::vowel::': 'a|ä|e|i|o|ö|u|ü',
    '::consonant::': 'b|c|ch|ck|d|dt|f|g|h|j|k|l|m|n|p|pf|r|s|sch|t|tsch|tz|tzsch|v|w|z|ʀ',
};

const rules = [
    't -> z / _ ion',
    's -> sch / # _ (p|t)',
    's -> <zed> / # _ (::vowel::)',
    'b -> p / _ #|(::consonant::)(::vowel::)',
    'd -> t / _ #|(::consonant::)(::vowel::)',
    'g -> k / _ #|(::consonant::)(::vowel::)',
    'r -> 0 / e _ #',
    'r -> ə / [äeioöuü]h? _ #|(::consonant::)',
    'r -> 0 / a _ #|(::consonant::)',
    'e -> ə / _ #',
    'i -> ie /  _ #|(::consonant::)(::vowel::)',
    'e -> ee / [^ei] _ #|(::consonant::)(::vowel::)',
    'ü -> üh /  _ #|(::consonant::)(::vowel::)',
    'ö -> öo /  _ #|(::consonant::)(::vowel::)',
    'u -> uh /  [^e]_ #|(::consonant::)(::vowel::)',
    'o -> oo / [^oö] _ #|(::consonant::)(::vowel::)',
    'a -> aa / [^a] _ #|(::consonant::)(::vowel::)',
];

const words = [
    'bastion',
    'station',
];

for(let i = 0; i < words.length; i++) {
    for(const rule of rules) {
        const r = new Rule(rule, charGroups);
        console.log(r.regex);
        words[i] = words[i].replace(r.regex, (_m, a, _b, c) => a + r._replacement + c);
    }
}

console.log(words);

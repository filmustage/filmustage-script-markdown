window.Tags =  [
        {value: 'place', name: 'place', key: 'PL', color: '#d23e24'},
        {value: 'location', name: 'location', key: 'LC', color: '#7b7aff'},
        {value: 'time', name: 'time', key: 'TM', color: '#d936db'},
        {value: 'prop', name: 'prop', key: 'PR', color: '#a6735e'},
        {value: 'actor', name: 'actor', key: 'AC', color: '#7265ab'},
        {value: 'actor-add', name: 'actor-add', key: 'ACA', color: '#909d6b'},
        {value: 'location-add', name: 'location-add', key: 'LCA', color: '#557f9d'},
        {value: 'extras', name: 'extras', key: 'EX', color: '#63a177'},
        {value: 'animal', name: 'animal', key: 'AN', color: '#c6a746'},
        {value: 'costume', name: 'costume', key: 'CO', color: '#df844c'},
        {value: 'vehicle', name: 'vehicle', key: 'VI', color: '#3c91a1'},
        {value: 'makeup', name: 'makeup', key: 'MK', color: '#b658ae'},
        {value: 'effect', name: 'effect', key: 'EF', color: '#63a377'},
        {value: 'sound', name: 'sound', key: 'SN', color: '#13a377'},
        {value: 'camera', name: 'camera', key: 'CM', color: '#13a355'},
        {value: 'delete-tag', name: 'delete-tag', key: 'DL', color: '#132255'}
      ]

module.exports = {

  touchBar:
    title: 'Touchbar'
    description: 'Copy this JSON for toutchbar package settings'
    type: 'string'
    default: ''

  enableColortags:
    title: 'Enable color highlight of tags'
    type: 'boolean'
    default: true
    order: 1
}

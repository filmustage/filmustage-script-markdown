window.Tags =  [
        {value: 'place', description: 'Place'},
        {value: 'location', description: 'Location'},
        {value: 'time', description: 'Time'},
        {value: 'prop', description: 'Prop'},
        {value: 'actor', description: 'Actor'},
        {value: 'actor-add', description: 'Actor-add'},
        {value: 'location-add', description: 'Location-add'},
        {value: 'extras', description: 'Extras'},
        {value: 'animal', description: 'Animal'},
        {value: 'delete-tag', description: 'Deleta tag'}
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

  f1Tag:
    title: 'F1 config'
    description: 'Default tag and color for `F1`'
    type: 'string'
    default: 'place'
    order: 2
    enum: Tags
  f1Color:
    title: ' '
    type: 'color'
    default: '#d23e24'
    order: 3

  f2Tag:
    title: 'F2 config'
    description: 'Default tag and color for `F2`'
    type: 'string'
    default: 'location'
    order: 4
    enum: Tags
  f2Color:
    title: ' '
    type: 'color'
    default: '#7b7aff'
    order: 5

  f3Tag:
    title: 'F3 config'
    description: 'Default tag and color for `F3`'
    type: 'string'
    default: 'time'
    order: 6
    enum: Tags
  f3Color:
    title: ' '
    type: 'color'
    default: '#d936db'
    order: 7

  f4Tag:
    title: 'F4 config'
    description: 'Default tag and color for `F4`'
    type: 'string'
    default: 'prop'
    order: 8
    enum: Tags
  f4Color:
    title: ' '
    type: 'color'
    default: '#00a36c'
    order: 9

  f5Tag:
    title: 'F5 config'
    description: 'Default tag and color for `F5`'
    type: 'string'
    default: 'actor'
    order: 10
    enum: Tags
  f5Color:
    title: ' '
    type: 'color'
    default: '#c8c817'
    order: 11

  f6Tag:
    title: 'F6 config'
    description: 'Default tag and color for `F6`'
    type: 'string'
    default: 'actor-add'
    order: 12
    enum: Tags
  f6Color:
    title: ' '
    type: 'color'
    default: '#d7d7a4'
    order: 13

  f7Tag:
    title: 'F7 config'
    description: 'Default tag and color for `F7`'
    type: 'string'
    default: 'location-add'
    order: 14
    enum: Tags
  f7Color:
    title: ' '
    type: 'color'
    default: '#0096ff'
    order: 15

  f8Tag:
    title: 'F8 config'
    description: 'Default tag and color for `F8`'
    type: 'string'
    default: 'extras'
    order: 16
    enum: Tags
  f8Color:
    title: ' '
    type: 'color'
    default: '#e98604'
    order: 17

  f9Tag:
    title: 'F9 config'
    description: 'Default tag and color for `F9`'
    type: 'string'
    default: 'animal'
    order: 18
    enum: Tags
  f9Color:
    title: ' '
    type: 'color'
    default: '#bb0da5'
    order: 19

  f10Tag:
    title: 'ALT+F1 config'
    description: 'Default tag and color for `ALT+F1`'
    type: 'string'
    default: 'delete-tag'
    order: 20
    enum: Tags
  f10Color:
    title: ' '
    type: 'color'
    default: '#000000'
    order: 21
}

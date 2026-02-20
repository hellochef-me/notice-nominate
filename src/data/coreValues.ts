export interface CoreValue {
  id: string
  label: string
  behaviors: string[]
}

export const coreValues: CoreValue[] = [
  {
    id: 'people-first',
    label: 'People First',
    behaviors: [
      'Be humble',
      'Emphasize team over self',
      'Provide thoughtful feedback',
    ],
  },
  {
    id: 'positive-spirit',
    label: 'Positive Spirit',
    behaviors: [
      'Look forward with optimism',
      'Respect all walks of life',
      'Celebrate, together',
    ],
  },
  {
    id: 'simplify',
    label: 'Simplify',
    behaviors: [
      'Less is more',
      'Learn and be curious',
      'Improve with each day',
    ],
  },
  {
    id: 'whatever-it-takes',
    label: 'Whatever It Takes',
    behaviors: [
      'Do the right thing',
      'Demonstrate passions and perseverance',
      'Roll up your sleeves',
    ],
  },
]

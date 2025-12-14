/**
 * TB Drug Dosage Calculator
 * Reference: DDC Thailand - ตารางที่ 5.1 ขนาดของยาที่แนะนำสำหรับผู้ใหญ่
 */
import { ref, computed } from 'vue'

export interface Drug {
  id: string
  name: string
  abbr: string
  dosePerKgMin: number
  dosePerKgMax: number
  // Weight band doses from DDC Table 5.1
  weightBands?: {
    '35-49': number
    '50-69': number
    '70+': number
  }
  fixedDoseMin?: number
  fixedDoseMax?: number
  maxDose: number
  tabletSizes: number[]
  type: 'oral' | 'injectable'
  category: 'first-line' | 'second-line'
  egfrNote: string
}

export interface DrugResult extends Drug {
  calculatedDose: number
  calculatedDoseMin: number
  calculatedDoseMax: number
  formattedDose: string
  tablets: { size: number; count: number }[]
  useWeightBand: boolean
}

const DRUGS: Drug[] = [
  // First-line (DDC Thailand ตารางที่ 5.1)
  { 
    id: 'isoniazid', name: 'Isoniazid', abbr: 'H', 
    dosePerKgMin: 4, dosePerKgMax: 6, maxDose: 300, 
    weightBands: { '35-49': 300, '50-69': 300, '70+': 300 },
    tabletSizes: [100], type: 'oral', category: 'first-line', 
    egfrNote: 'ไม่ต้องปรับขนาดยา' 
  },
  { 
    id: 'rifampicin', name: 'Rifampicin', abbr: 'R', 
    dosePerKgMin: 8, dosePerKgMax: 12, maxDose: 600, 
    weightBands: { '35-49': 450, '50-69': 600, '70+': 600 },
    tabletSizes: [300, 450], type: 'oral', category: 'first-line', 
    egfrNote: 'ไม่ต้องปรับขนาดยา' 
  },
  { 
    id: 'pyrazinamide', name: 'Pyrazinamide', abbr: 'Z', 
    dosePerKgMin: 20, dosePerKgMax: 30, maxDose: 2000, 
    weightBands: { '35-49': 1000, '50-69': 1500, '70+': 2000 },
    tabletSizes: [500], type: 'oral', category: 'first-line', 
    egfrNote: 'eGFR <30: ให้ 3 ครั้ง/สัปดาห์' 
  },
  { 
    id: 'ethambutol', name: 'Ethambutol', abbr: 'E', 
    dosePerKgMin: 15, dosePerKgMax: 20, maxDose: 1200, 
    weightBands: { '35-49': 800, '50-69': 1000, '70+': 1200 },
    tabletSizes: [400, 500], type: 'oral', category: 'first-line', 
    egfrNote: 'eGFR <30: ให้ 3 ครั้ง/สัปดาห์' 
  },
  // Second-line (DDC Thailand / WHO Guidelines)
  { 
    id: 'levofloxacin-oral', name: 'Levofloxacin (เม็ด)', abbr: 'Lfx', 
    dosePerKgMin: 0, dosePerKgMax: 0, 
    fixedDoseMin: 750, fixedDoseMax: 1000, maxDose: 1000, 
    tabletSizes: [500, 750], type: 'oral', category: 'second-line', 
    egfrNote: 'eGFR 20-49: 750mg วันเว้นวัน | <20: 500mg วันเว้นวัน' 
  },
  { 
    id: 'levofloxacin-iv', name: 'Levofloxacin (ฉีด)', abbr: 'Lfx', 
    dosePerKgMin: 0, dosePerKgMax: 0, 
    fixedDoseMin: 750, fixedDoseMax: 1000, maxDose: 1000, 
    tabletSizes: [], type: 'injectable', category: 'second-line', 
    egfrNote: 'eGFR 20-49: 750mg วันเว้นวัน | <20: 500mg วันเว้นวัน' 
  },
  { 
    id: 'streptomycin', name: 'Streptomycin', abbr: 'S', 
    dosePerKgMin: 15, dosePerKgMax: 25, maxDose: 1000, 
    tabletSizes: [], type: 'injectable', category: 'second-line', 
    egfrNote: 'eGFR <30: ให้ 2-3 ครั้ง/สัปดาห์' 
  },
  { 
    id: 'amikacin', name: 'Amikacin', abbr: 'Am', 
    dosePerKgMin: 15, dosePerKgMax: 20, maxDose: 1000, 
    tabletSizes: [], type: 'injectable', category: 'second-line', 
    egfrNote: 'eGFR <60: ปรับความถี่การให้ยา' 
  },
]

// Get weight band key based on weight
function getWeightBand(weight: number): '35-49' | '50-69' | '70+' | null {
  if (weight >= 35 && weight <= 49) return '35-49'
  if (weight >= 50 && weight <= 69) return '50-69'
  if (weight >= 70) return '70+'
  return null // Weight < 35, needs calculation
}

export function useDrugCalculator() {
  const weight = ref<number | null>(null)
  const results = ref<DrugResult[]>([])
  const hasCalculated = ref(false)

  function calculate() {
    if (!weight.value || weight.value <= 0 || weight.value > 200) return false

    const weightBand = getWeightBand(weight.value)

    results.value = DRUGS.map(drug => {
      let dose: number
      let useWeightBand = false

      // Calculate lower and upper bounds based on weight
      const doseMin = Math.min(weight.value! * drug.dosePerKgMin, drug.maxDose)
      const doseMax = Math.min(weight.value! * drug.dosePerKgMax, drug.maxDose)

      // Priority: 1. Fixed dose, 2. Weight band, 3. Calculate
      if (drug.fixedDoseMin !== undefined && drug.fixedDoseMax !== undefined) {
        // Fixed dose drugs (e.g., Levofloxacin for TB)
        dose = drug.fixedDoseMax!
      } else if (drug.weightBands && weightBand) {
        // Use DDC weight band table
        dose = drug.weightBands[weightBand]
        useWeightBand = true
      } else {
        // Calculate by weight (for <35kg or drugs without weight bands)
        dose = Math.min(weight.value! * drug.dosePerKgMax, drug.maxDose)
      }
      
      return {
        ...drug,
        calculatedDose: dose,
        calculatedDoseMin: doseMin,
        calculatedDoseMax: doseMax,
        formattedDose: `${Math.round(dose)} mg`,
        tablets: drug.tabletSizes.map(size => ({
          size,
          count: Math.round((dose / size) * 2) / 2 // Round to 0.5
        })),
        useWeightBand
      }
    })
    hasCalculated.value = true
    return true
  }

  const firstLineDrugs = computed(() => results.value.filter(d => d.category === 'first-line'))
  const secondLineDrugs = computed(() => results.value.filter(d => d.category === 'second-line'))

  return { weight, results, hasCalculated, firstLineDrugs, secondLineDrugs, calculate }
}

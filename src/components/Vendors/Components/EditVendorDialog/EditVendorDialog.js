import { computed, reactive, watch, ref } from 'vue'

export default {
  setup(props, { emit }) {
    const model = computed({
      get: () => props.modelValue,
      set: (v) => emit('update:modelValue', v),
    })

    const step = ref(1)

    // initialize form from props.data (keep File objects)
    const form = reactive(makeInitialForm(props.data))
    watch(
      () => props.data,
      (val) => {
        Object.assign(form, makeInitialForm(val))
        step.value = 1
      },
      { deep: true },
    )

    function makeInitialForm(src) {
      // shallow copy is enough for primitives + File refs
      const f = {
        // page 1
        lastName: '',
        firstName: '',
        middleName: '',
        suffix: '',
        birthdate: '',
        gender: 'Male',
        phone: '',
        email: '',
        vendorId: '',
        address: '',
        spouseLast: '',
        spouseFirst: '',
        spouseMiddle: '',
        childLast: '',
        childFirst: '',
        childMiddle: '',
        // page 2
        businessName: '',
        businessType: '',
        productsSold: '',
        vendStart: '',
        vendEnd: '',
        businessAddress: '',
        // files
        files: {
          clearance: null,
          votersId: null,
          cedula: null,
          picture: null,
          association: null,
          healthcard: null,
        },
      }
      // merge incoming data if present
      if (src && typeof src === 'object') {
        Object.assign(f, src)
        f.files = { ...f.files, ...(src.files || {}) }
      }
      return f
    }

    function goNext() {
      // very light check
      if (!form.firstName || !form.lastName || !form.vendorId)
        return alert('Please complete required fields.')
      step.value = 2
    }

    function submit() {
      // return both compact row and full raw payload
      const updatedRow = {
        id: form.vendorId,
        name: [form.firstName, form.lastName].filter(Boolean).join(' '),
        business: form.businessName,
        collector: 'John Smith',
        status: 'Active',
        raw: { ...form, files: { ...form.files } }, // keep File refs
      }
      emit('update', updatedRow)
      model.value = false
    }

    function cancel() {
      model.value = false
      step.value = 1
    }

    return {
      model,
      step,
      form,
      goNext,
      submit,
      cancel
    }
  },
  props: {
    modelValue: { type: Boolean, default: false },
    /** pass the full vendor payload (what you stored in item.raw) */
    data: { type: Object, default: () => ({}) },
  },
  emits: ['update:modelValue', 'update']
}
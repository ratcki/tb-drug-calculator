// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'th'
      },
      title: 'TB Drug Calculator | เครื่องคำนวณยาวัณโรค',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'เครื่องมือช่วยคำนวณขนาดยาต้านวัณโรคตามน้ำหนักตัว พร้อมแสดงจำนวนเม็ดยาและคำแนะนำการปรับยาตามค่า eGFR'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})

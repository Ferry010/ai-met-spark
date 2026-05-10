# P0 status v1 launch

Status na deze ronde:

1. **Voortgang per gebruiker** ✅
   - Migratie met unique index op `user_progress(user_id, lesson_id)` is gedraaid.
   - Nieuwe hook `useUserProgress()` (React Query) doet de fetch + upsert + reset, met cache invalidatie.
   - Dashboard, WorldPage, LessonPage en Account gebruiken de hook.

2. **Betaalmuur** ✅
   - Volledig verwijderd. App is gratis. Stripe-functions weg, `paid` kolom weg.

3. **Ouder-mail** ⏸️
   - Uitgesteld tot custom hosting/domein. Komt later.

4. **Account opschonen** ✅
   - `Account.tsx` heeft editable velden, password reset, voortgang resetten en account verwijderen via edge function.

5. **Pricing** ✅
   - Gratis-copy en school-CTA staan.

6. **Diploma pdf** ✅
   - jsPDF bouwt het diploma client-side, upload naar `certificates/<user_id>/diploma.pdf` en koppelt via `attach_certificate_pdf`. Custom fonts + sierranden worden goed gerenderd; server-side puppeteer is overkill.

## Wat er nog open staat
- Ouder-mail (`notify-parent` edge function + transactional email). Pak ik op zodra hosting/domein klaar is.

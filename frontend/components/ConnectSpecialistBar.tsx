import Link from "next/link";

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.2 11.2 20.4 4.4c.8-.3 1.5.5 1.1 1.3l-3.1 8.8c-.2.6-.9.8-1.4.4l-3.5-2.7-1.7 2.1c-.4.5-1.2.2-1.2-.5v-3.2l9.8-6.6-8.4 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OrangeChevron() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden="true">
      <path d="M0 0L10 6L0 12V0Z" fill="#f97316" />
    </svg>
  );
}

export default function ConnectSpecialistBar() {
  return (
    <section
      id="contact"
      className="relative border-b-2 border-[#f97316] bg-[#f3f3f8]"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="h-0 w-0 border-x-[18px] border-t-[22px] border-x-transparent border-t-[#f97316] sm:border-x-[22px] sm:border-t-[28px]" />
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col gap-5 px-5 py-5 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-10">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 text-[#4b4f63] transition-colors hover:text-[#2f3347]"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8a8da4] text-white transition-colors group-hover:bg-[#767a94]">
            <SendIcon />
          </span>
          <span className="text-[15px] font-medium tracking-[-0.01em] sm:text-[16px]">
            Connect with Specialist
          </span>
          <OrangeChevron />
        </Link>

        <p className="max-w-xl text-center text-[13px] leading-6 text-[#5c6074] sm:text-[14px] lg:flex-1 lg:text-left">
          Send us your requirements, we will get back to you soon with details
        </p>

        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center justify-center self-center rounded-full bg-[#545871] px-7 py-3 text-[12px] font-bold tracking-[0.12em] text-white transition-colors hover:bg-[#43465d] sm:px-8 sm:py-3.5 sm:text-[13px] lg:self-auto"
        >
          SUBMIT HERE
        </Link>
      </div>
    </section>
  );
}

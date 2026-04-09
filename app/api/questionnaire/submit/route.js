// app/api/questionnaire/submit/route.js
// API endpoint to create a lead from the questionnaire

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import QuestionnaireConfirmationEmail from '@/emails/QuestionnaireConfirmationEmail';
import { calculateQuoteFromSelections, formatCurrency } from '@/lib/quoteCalculations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { contactInfo, serviceSelections } = body;

    // Validate required fields
    if (!contactInfo?.name?.trim()) {
      return NextResponse.json(
        { error: 'Ime je obavezno polje' },
        { status: 400 }
      );
    }

    if (!contactInfo?.email?.trim()) {
      return NextResponse.json(
        { error: 'Email je obavezno polje' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      return NextResponse.json(
        { error: 'Unesite ispravnu email adresu' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Build description from selections
    const description = buildDescriptionFromSelections(serviceSelections);

    // Determine project type from selections
    const projectType = determineProjectType(serviceSelections);

    // Create the lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        name: contactInfo.name.trim(),
        email: contactInfo.email.trim(),
        phone: contactInfo.phone?.trim() || null,
        company: contactInfo.company?.trim() || null,
        status: 'new',
        source: 'questionnaire',
        project_type: projectType,
        description: description,
        service_selections: serviceSelections
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Greška pri spremanju podataka. Pokušajte ponovo.' },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      const selectedServices = getSelectedServiceNames(serviceSelections);
      const quoteResult = calculateQuoteFromSelections(serviceSelections);
      const monthlyTotal = quoteResult.summary?.monthly?.total || 0;
      const oneTimeTotal = quoteResult.summary?.oneTime?.total || 0;

      await resend.emails.send({
        from: 'NineFold <hello@ninefold.co>',
        to: contactInfo.email.trim(),
        subject: 'Zaprimili smo vaš upit | NineFold',
        react: QuestionnaireConfirmationEmail({
          clientName: contactInfo.name.trim().split(' ')[0],
          selectedServices: selectedServices,
          estimatedMonthly: monthlyTotal > 0 ? formatCurrency(monthlyTotal) + '/mj' : null,
          estimatedOneTime: oneTimeTotal > 0 ? formatCurrency(oneTimeTotal) : null,
        }),
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Failed to send confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Hvala na upitu! Javit ćemo vam se uskoro.'
    });

  } catch (error) {
    console.error('Questionnaire submit error:', error);
    return NextResponse.json(
      { error: 'Interna greška servera' },
      { status: 500 }
    );
  }
}

/**
 * Build a human-readable description from selections
 */
function buildDescriptionFromSelections(selections) {
  const parts = [];

  if (selections?.webDevelopment?.enabled) {
    const pkg = selections.webDevelopment.package;
    parts.push(`Web Development: ${pkg || 'odabran'}`);
    if (selections.webDevelopment.maintenance?.enabled) {
      parts.push('+ održavanje');
    }
  }

  if (selections?.appDevelopment?.enabled) {
    const pkg = selections.appDevelopment.package;
    parts.push(`App Development: ${pkg || 'odabran'}`);
    if (selections.appDevelopment.customPrice) {
      parts.push(`(custom: €${selections.appDevelopment.customPrice})`);
    }
  }

  if (selections?.socialMedia?.enabled) {
    const plan = selections.socialMedia.plan;
    parts.push(`Social Media: ${plan || 'odabran'}`);
    if (selections.socialMedia.contractLength) {
      parts.push(`(${selections.socialMedia.contractLength} mjeseci)`);
    }
  }

  if (selections?.podcastStudio?.enabled) {
    const duration = selections.podcastStudio.duration;
    const shorts = selections.podcastStudio.shortsPackage;
    parts.push(`Podcast Studio: ${duration || 'odabran'}, ${shorts || '?'} shorts`);
  }

  if (selections?.additionalFilmingDays > 0) {
    parts.push(`Dodatni dani snimanja: ${selections.additionalFilmingDays}`);
  }

  if (parts.length === 0) {
    return 'Klijent je popunio upitnik bez specifičnih odabira usluga.';
  }

  return `Upit iz upitnika:\n\n${parts.join('\n')}`;
}

/**
 * Determine the primary project type from selections
 */
function determineProjectType(selections) {
  if (selections?.webDevelopment?.enabled) return 'website';
  if (selections?.appDevelopment?.enabled) return 'web-app';
  if (selections?.socialMedia?.enabled) return 'social-media';
  if (selections?.podcastStudio?.enabled) return 'video';
  return 'other';
}

/**
 * Get human-readable service names for email
 */
function getSelectedServiceNames(selections) {
  const services = [];

  if (selections?.webDevelopment?.enabled) {
    const packageNames = { temelj: 'Temelj', rast: 'Rast', vrhunac: 'Vrhunac' };
    const pkg = selections.webDevelopment.package;
    services.push(`Web stranica${pkg ? ` - ${packageNames[pkg] || pkg}` : ''}`);
  }

  if (selections?.appDevelopment?.enabled) {
    const packageNames = { start: 'Start', sustav: 'Sustav', enterprise: 'Enterprise' };
    const pkg = selections.appDevelopment.package;
    services.push(`Web aplikacija${pkg ? ` - ${packageNames[pkg] || pkg}` : ''}`);
  }

  if (selections?.socialMedia?.enabled) {
    const planNames = { prisutnost: 'Prisutnost', momentum: 'Momentum', dominacija: 'Dominacija' };
    const plan = selections.socialMedia.plan;
    services.push(`Društvene mreže${plan ? ` - ${planNames[plan] || plan}` : ''}`);
  }

  if (selections?.podcastStudio?.enabled) {
    services.push('Podcast studio');
  }

  if (selections?.additionalFilmingDays > 0) {
    services.push(`${selections.additionalFilmingDays} dodatnih dana snimanja`);
  }

  return services;
}

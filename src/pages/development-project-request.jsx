import React, { useState, useRef } from "react";
import { graphql } from "gatsby";
import { Link, useI18next, useTranslation, navigate } from "gatsby-plugin-react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send, Upload, X, FileText } from "lucide-react";

import Layout from "../components/layout";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

const API_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

const formSchema = z.object({
  applicant: z.object({
    full_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    age: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().int().positive().optional()),
    marital_status: z.enum(["أعزب", "متزوج", "مطلق", "أرمل"]).optional(),
    faith_testimony: z.string().min(50),
    church_membership_since: z.string().optional()
  }),
  church: z.object({
    church_name: z.string().min(1),
    address: z.string().min(1),
    governorate: z.string().min(1),
    phone: z.string().optional(),
    denomination: z.string().optional(),
    established_year: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().int().min(1900).optional()),
    average_sunday_attendance: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().int().positive().optional()),
    has_church_council: z.boolean(),
    council_members_names: z.string().optional(),
    church_community_photos: z.string().optional()
  }),
  project_core: z.object({
    project_name: z.string().min(1),
    is_new_project: z.boolean(),
    planned_start_date: z.string().optional(),
    requested_amount_egp: z.coerce.number().positive(),
    previously_received_this_grant: z.boolean(),
    previous_grant_year: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().int().min(2000).optional())
  }),
  project_details: z.object({
    community_overview: z.string().min(100),
    number_and_types_of_churches: z.string().optional(),
    schools_in_area: z.string().optional(),
    government_and_public_services: z.string().optional(),
    other_community_features: z.string().optional(),

    similar_projects_exist: z.boolean(),
    similar_projects_details: z.string().optional(),

    project_summary: z.string().min(80),
    goals: z.object({
      "روحية": z.string().min(1),
      "اجتماعية": z.string().min(1),
      "اقتصادية": z.string().min(1),
      "أخرى": z.string().min(1)
    }),
    how_goals_will_be_achieved: z.string().min(100),

    beneficiaries_approximate_number: z.coerce.number().int().positive(),
    beneficiaries_main_categories: z.string().min(1),
    beneficiaries_relation_to_church: z.string().min(1),
    beneficiaries_specific_needs: z.string().min(1),

    implementation_team: z
      .array(
        z.object({
          name: z.string().optional(),
          role: z.string().optional(),
          experience_qualifications: z.string().optional()
        })
      )
      .default([]),

    beneficiaries_contribution: z.string().min(1),

    monitoring_responsible_name_or_committee: z.string().min(1),
    monitoring_responsible_position: z.string().min(1),
    monitoring_plan: z.string().min(1),

    sustainability_plan: z.string().min(100),
    expected_ongoing_income_sufficient: z.boolean(),
    ongoing_funding_sources: z.string().optional(),

    church_contribution: z.object({
      "مالية": z.string().min(1),
      "بشرية": z.string().min(1),
      "عينية": z.string().min(1),
      "أخرى": z.string().min(1)
    }),

    project_location_photos: z.string().optional()
  }),
  financials: z.object({
    previous_year_church_income: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().positive().optional()),
    previous_year_church_expenses: z.preprocess((v) => (v === "" || v === null ? undefined : v), z.coerce.number().positive().optional()),
    project_income_items: z
      .array(z.object({ source: z.string().min(1), amount: z.coerce.number().positive() }))
      .default([]),
    project_expense_items: z
      .array(z.object({ item: z.string().min(1), amount: z.coerce.number().positive() }))
      .default([]),
    previous_expenses_exempt_or_relevant: z
      .array(z.object({ item: z.string().min(1), amount: z.coerce.number().positive() }))
      .default([])
  }),
  additional_attachments: z.string().optional(),
  applicant_signature_name: z.string().min(1),
  church_seal_applied: z.boolean().optional()
});

const DevelopmentProjectRequestPage = () => {
  const { t } = useTranslation("DevelopmentProjectRequest");
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || "en";
  const isRTL = currentLanguage === "ar";
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant: {
        full_name: "",
        email: "",
        phone: "",
        age: undefined,
        marital_status: undefined,
        faith_testimony: "",
        church_membership_since: ""
      },
      church: {
        church_name: "",
        address: "",
        governorate: "",
        phone: "",
        denomination: "",
        established_year: undefined,
        average_sunday_attendance: undefined,
        has_church_council: false,
        council_members_names: "",
        church_community_photos: ""
      },
      project_core: {
        project_name: "",
        is_new_project: true,
        planned_start_date: "",
        requested_amount_egp: 1,
        previously_received_this_grant: false,
        previous_grant_year: undefined
      },
      project_details: {
        community_overview: "",
        number_and_types_of_churches: "",
        schools_in_area: "",
        government_and_public_services: "",
        other_community_features: "",

        similar_projects_exist: false,
        similar_projects_details: "",

        project_summary: "",
        goals: { "روحية": "", "اجتماعية": "", "اقتصادية": "", "أخرى": "" },
        how_goals_will_be_achieved: "",

        beneficiaries_approximate_number: 1,
        beneficiaries_main_categories: "",
        beneficiaries_relation_to_church: "",
        beneficiaries_specific_needs: "",

        implementation_team: [],

        beneficiaries_contribution: "",

        monitoring_responsible_name_or_committee: "",
        monitoring_responsible_position: "",
        monitoring_plan: "",

        sustainability_plan: "",
        expected_ongoing_income_sufficient: false,
        ongoing_funding_sources: "",

        church_contribution: { "مالية": "", "بشرية": "", "عينية": "", "أخرى": "" },

        project_location_photos: ""
      },
      financials: {
        previous_year_church_income: undefined,
        previous_year_church_expenses: undefined,
        project_income_items: [],
        project_expense_items: [],
        previous_expenses_exempt_or_relevant: []
      },
      additional_attachments: "",
      applicant_signature_name: "",
      church_seal_applied: undefined
    }
  });

  // File handling functions
  const handleFiles = (files) => {
    // Filter valid files
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/jpg', 'image/png'];
      const validExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(file.mimetype) && !validExtensions.includes(ext)) {
        toast({
          title: t("fields.attachments.invalidType"),
          description: file.name,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t("fields.attachments.fileSizeError"),
          description: file.name,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    // Check max files limit
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > 3) {
      toast({
        title: t("fields.attachments.maxFilesError"),
        variant: "destructive"
      });
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Build FormData for file upload
      const formData = new FormData();

      const application = {
        applicant: {
          ...data.applicant,
          age: data.applicant.age || undefined
        },
        church: {
          ...data.church,
          established_year: data.church.established_year || undefined,
          average_sunday_attendance: data.church.average_sunday_attendance || undefined,
          council_members_names: data.church.council_members_names
            ? data.church.council_members_names
                .split(/[,;\n]/)
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
          church_community_photos: data.church.church_community_photos
            ? data.church.church_community_photos
                .split(/[\n,]/)
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined
        },
        project_core: {
          ...data.project_core,
          planned_start_date: data.project_core.planned_start_date || undefined,
          previous_grant_year: data.project_core.previous_grant_year || undefined
        },
        project_details: {
          community_overview: data.project_details.community_overview,
          number_and_types_of_churches: data.project_details.number_and_types_of_churches || undefined,
          schools_in_area: data.project_details.schools_in_area || undefined,
          government_and_public_services: data.project_details.government_and_public_services || undefined,
          other_community_features: data.project_details.other_community_features || undefined,

          similar_projects_exist: data.project_details.similar_projects_exist,
          similar_projects_details: data.project_details.similar_projects_details || undefined,

          project_summary: data.project_details.project_summary,
          goals: data.project_details.goals,
          how_goals_will_be_achieved: data.project_details.how_goals_will_be_achieved,

          beneficiaries: {
            approximate_number: data.project_details.beneficiaries_approximate_number,
            main_categories: data.project_details.beneficiaries_main_categories
              .split(/[,;\n]/)
              .map((s) => s.trim())
              .filter(Boolean),
            relation_to_church: data.project_details.beneficiaries_relation_to_church,
            specific_needs: data.project_details.beneficiaries_specific_needs
          },

          implementation_team: (data.project_details.implementation_team || []).filter(
            (m) => m?.name?.trim() && m?.role?.trim() && m?.experience_qualifications?.trim()
          ),

          beneficiaries_contribution: data.project_details.beneficiaries_contribution,

          monitoring_responsible_name_or_committee: data.project_details.monitoring_responsible_name_or_committee,
          monitoring_responsible_position: data.project_details.monitoring_responsible_position,
          monitoring_plan: data.project_details.monitoring_plan,

          sustainability_plan: data.project_details.sustainability_plan,
          expected_ongoing_income_sufficient: data.project_details.expected_ongoing_income_sufficient,
          ongoing_funding_sources: data.project_details.ongoing_funding_sources || undefined,

          church_contribution: data.project_details.church_contribution,

          project_location_photos: data.project_details.project_location_photos
            ? data.project_details.project_location_photos
                .split(/[\n,]/)
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined
        },
        financials: data.financials,
        commitments: {
          no_political_use: true,
          religious_charitable_use_only: true,
          accept_10_percent_admin_fee: true,
          commit_to_annual_report_and_receipts: true,
          accept_2000_egp_withhold_last_payment: true
        },
        additional_attachments: data.additional_attachments
          ? data.additional_attachments
              .split(/[\n,]/)
              .map((s) => s.trim())
              .filter(Boolean)
          : undefined,
        applicant_signature_name: data.applicant_signature_name,
        church_seal_applied: data.church_seal_applied
      };

      formData.append("application", JSON.stringify(application));
      
      // Append files
      selectedFiles.forEach(file => {
        formData.append("attachments", file);
      });

      const response = await fetch(`${API_URL}/development-project-requests`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t("toast.error.description"));
      }

      toast({
        title: t("toast.success.title"),
        description: t("toast.success.description")
      });

      form.reset();
      setSelectedFiles([]);
      // Give the toast a moment to render before leaving the page
      setTimeout(() => {
        navigate("/development-department");
      }, 600);
    } catch (error) {
      toast({
        title: t("toast.error.title"),
        description: error.message || t("toast.error.description"),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle={t("pageTitle")}
    >
      <HeaderTwo />
      <StickyHeader />
      <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link to="/development-department" className="inline-flex">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground group">
                  <ArrowLeft className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"} group-hover:-translate-x-1 transition-transform`} />
                  {t("buttons.back")}
                </Button>
              </Link>
            </div>

            <div className={`text-center mb-10 ${isRTL ? "rtl" : ""}`}>
              <h1 className={`text-4xl sm:text-5xl font-bold text-foreground mb-4 ${isRTL ? "font-arabic" : ""}`}>{t("header.title")}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t("header.description")}</p>
            </div>

            <Card className="shadow-2xl border border-border/30 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#2194D1]/5 via-background to-background border-b border-border/30">
                <CardTitle className="text-2xl text-foreground">{t("form.title")}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">{t("form.subtitle")}</CardDescription>
              </CardHeader>

              <CardContent className="p-8 sm:p-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">{t("sections.requester")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="applicant.full_name">{t("fields.applicant.full_name.label")} *</Label>
                        <Input id="applicant.full_name" {...form.register("applicant.full_name")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="applicant.phone">{t("fields.applicant.phone.label")} *</Label>
                        <Input id="applicant.phone" {...form.register("applicant.phone")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="applicant.email">{t("fields.applicant.email.label")} *</Label>
                        <Input id="applicant.email" type="email" {...form.register("applicant.email")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="applicant.age">{t("fields.applicant.age.label")}</Label>
                        <Input id="applicant.age" type="number" min={1} {...form.register("applicant.age")} />
                      </div>
                      <div className="space-y-3">
                        <Label>{t("fields.applicant.marital_status.label")}</Label>
                        <input type="hidden" {...form.register("applicant.marital_status")} />
                        <Select
                          value={form.watch("applicant.marital_status") || ""}
                          onValueChange={(value) => form.setValue("applicant.marital_status", value || undefined, { shouldValidate: true })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("fields.applicant.marital_status.placeholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="أعزب">{t("fields.applicant.marital_status.options.single")}</SelectItem>
                            <SelectItem value="متزوج">{t("fields.applicant.marital_status.options.married")}</SelectItem>
                            <SelectItem value="مطلق">{t("fields.applicant.marital_status.options.divorced")}</SelectItem>
                            <SelectItem value="أرمل">{t("fields.applicant.marital_status.options.widowed")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="applicant.faith_testimony">{t("fields.applicant.faith_testimony.label")} *</Label>
                        <Textarea id="applicant.faith_testimony" rows={5} {...form.register("applicant.faith_testimony")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="applicant.church_membership_since">{t("fields.applicant.church_membership_since.label")}</Label>
                        <Input id="applicant.church_membership_since" {...form.register("applicant.church_membership_since")} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">{t("sections.church")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="church.church_name">{t("fields.church.church_name.label")} *</Label>
                        <Input id="church.church_name" {...form.register("church.church_name")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="church.denomination">{t("fields.church.denomination.label")}</Label>
                        <Input id="church.denomination" {...form.register("church.denomination")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="church.governorate">{t("fields.church.governorate.label")} *</Label>
                        <Input id="church.governorate" {...form.register("church.governorate")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="church.phone">{t("fields.church.phone.label")}</Label>
                        <Input id="church.phone" {...form.register("church.phone")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="church.address">{t("fields.church.address.label")} *</Label>
                        <Textarea id="church.address" rows={4} {...form.register("church.address")} />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="church.has_church_council"
                            checked={form.watch("church.has_church_council")}
                            onCheckedChange={(checked) => form.setValue("church.has_church_council", !!checked, { shouldValidate: true })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="church.has_church_council" className="cursor-pointer">
                              {t("fields.church.has_church_council.label")} *
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="church.council_members_names">
                          {t("fields.church.council_members_names.label")}
                        </Label>
                        <Textarea id="church.council_members_names" rows={3} {...form.register("church.council_members_names")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="church.church_community_photos">
                          {t("fields.church.church_community_photos.label")}
                        </Label>
                        <Textarea id="church.church_community_photos" rows={3} {...form.register("church.church_community_photos")} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">{t("sections.project")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_core.project_name">{t("fields.project_core.project_name.label")} *</Label>
                        <Input id="project_core.project_name" {...form.register("project_core.project_name")} />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="project_core.is_new_project"
                            checked={form.watch("project_core.is_new_project")}
                            onCheckedChange={(checked) => form.setValue("project_core.is_new_project", !!checked, { shouldValidate: true })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="project_core.is_new_project" className="cursor-pointer">
                              {t("fields.project_core.is_new_project.label")} *
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="project_core.requested_amount_egp">{t("fields.project_core.requested_amount_egp.label")} *</Label>
                        <Input id="project_core.requested_amount_egp" type="number" min={0.01} step="0.01" {...form.register("project_core.requested_amount_egp")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="project_core.planned_start_date">{t("fields.project_core.planned_start_date.label")}</Label>
                        <Input id="project_core.planned_start_date" type="date" {...form.register("project_core.planned_start_date")} />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="project_core.previously_received_this_grant"
                            checked={form.watch("project_core.previously_received_this_grant")}
                            onCheckedChange={(checked) => form.setValue("project_core.previously_received_this_grant", !!checked, { shouldValidate: true })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="project_core.previously_received_this_grant" className="cursor-pointer">
                              {t("fields.project_core.previously_received_this_grant.label")} *
                            </Label>
                          </div>
                        </div>
                      </div>
                      {form.watch("project_core.previously_received_this_grant") ? (
                        <div className="space-y-3">
                          <Label htmlFor="project_core.previous_grant_year">{t("fields.project_core.previous_grant_year.label")}</Label>
                          <Input id="project_core.previous_grant_year" type="number" min={2000} {...form.register("project_core.previous_grant_year")} />
                        </div>
                      ) : null}

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.community_overview">{t("fields.project_details.community_overview.label")} *</Label>
                        <Textarea id="project_details.community_overview" rows={5} {...form.register("project_details.community_overview")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.project_summary">{t("fields.project_details.project_summary.label")} *</Label>
                        <Textarea id="project_details.project_summary" rows={4} {...form.register("project_details.project_summary")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label>{t("fields.project_details.goals.label")} *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="project_details.goals.روحية">{t("fields.project_details.goals.spiritual")}</Label>
                            <Textarea id="project_details.goals.روحية" rows={3} {...form.register("project_details.goals.روحية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.goals.اجتماعية">{t("fields.project_details.goals.social")}</Label>
                            <Textarea id="project_details.goals.اجتماعية" rows={3} {...form.register("project_details.goals.اجتماعية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.goals.اقتصادية">{t("fields.project_details.goals.economic")}</Label>
                            <Textarea id="project_details.goals.اقتصادية" rows={3} {...form.register("project_details.goals.اقتصادية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.goals.أخرى">{t("fields.project_details.goals.other")}</Label>
                            <Textarea id="project_details.goals.أخرى" rows={3} {...form.register("project_details.goals.أخرى")} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.how_goals_will_be_achieved">{t("fields.project_details.how_goals_will_be_achieved.label")} *</Label>
                        <Textarea id="project_details.how_goals_will_be_achieved" rows={5} {...form.register("project_details.how_goals_will_be_achieved")} />
                      </div>

                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="project_details.similar_projects_exist"
                            checked={form.watch("project_details.similar_projects_exist")}
                            onCheckedChange={(checked) => form.setValue("project_details.similar_projects_exist", !!checked, { shouldValidate: true })}
                          />
                          <div className="space-y-1">
                            <Label htmlFor="project_details.similar_projects_exist" className="cursor-pointer">
                              {t("fields.project_details.similar_projects_exist.label")} *
                            </Label>
                          </div>
                        </div>
                      </div>
                      {form.watch("project_details.similar_projects_exist") ? (
                        <div className="space-y-3 md:col-span-2">
                          <Label htmlFor="project_details.similar_projects_details">
                            {t("fields.project_details.similar_projects_details.label")}
                          </Label>
                          <Textarea id="project_details.similar_projects_details" rows={3} {...form.register("project_details.similar_projects_details")} />
                        </div>
                      ) : null}

                      <div className="space-y-3">
                        <Label htmlFor="project_details.beneficiaries_approximate_number">{t("fields.project_details.beneficiaries_approximate_number.label")} *</Label>
                        <Input id="project_details.beneficiaries_approximate_number" type="number" min={1} {...form.register("project_details.beneficiaries_approximate_number")} />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="project_details.beneficiaries_main_categories">{t("fields.project_details.beneficiaries_main_categories.label")} *</Label>
                        <Input id="project_details.beneficiaries_main_categories" {...form.register("project_details.beneficiaries_main_categories")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.beneficiaries_relation_to_church">{t("fields.project_details.beneficiaries_relation_to_church.label")} *</Label>
                        <Input id="project_details.beneficiaries_relation_to_church" {...form.register("project_details.beneficiaries_relation_to_church")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.beneficiaries_specific_needs">{t("fields.project_details.beneficiaries_specific_needs.label")} *</Label>
                        <Textarea id="project_details.beneficiaries_specific_needs" rows={3} {...form.register("project_details.beneficiaries_specific_needs")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.beneficiaries_contribution">{t("fields.project_details.beneficiaries_contribution.label")} *</Label>
                        <Textarea id="project_details.beneficiaries_contribution" rows={3} {...form.register("project_details.beneficiaries_contribution")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.monitoring_responsible_name_or_committee">{t("fields.project_details.monitoring_responsible_name_or_committee.label")} *</Label>
                        <Input id="project_details.monitoring_responsible_name_or_committee" {...form.register("project_details.monitoring_responsible_name_or_committee")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.monitoring_responsible_position">{t("fields.project_details.monitoring_responsible_position.label")} *</Label>
                        <Input id="project_details.monitoring_responsible_position" {...form.register("project_details.monitoring_responsible_position")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.monitoring_plan">{t("fields.project_details.monitoring_plan.label")} *</Label>
                        <Textarea id="project_details.monitoring_plan" rows={4} {...form.register("project_details.monitoring_plan")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.sustainability_plan">{t("fields.project_details.sustainability_plan.label")} *</Label>
                        <Textarea id="project_details.sustainability_plan" rows={4} {...form.register("project_details.sustainability_plan")} />
                      </div>
                      <div className="space-y-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="project_details.expected_ongoing_income_sufficient"
                            checked={form.watch("project_details.expected_ongoing_income_sufficient")}
                            onCheckedChange={(checked) =>
                              form.setValue("project_details.expected_ongoing_income_sufficient", !!checked, { shouldValidate: true })
                            }
                          />
                          <div className="space-y-1">
                            <Label htmlFor="project_details.expected_ongoing_income_sufficient" className="cursor-pointer">
                              {t("fields.project_details.expected_ongoing_income_sufficient.label")} *
                            </Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="project_details.ongoing_funding_sources">{t("fields.project_details.ongoing_funding_sources.label")}</Label>
                        <Textarea id="project_details.ongoing_funding_sources" rows={3} {...form.register("project_details.ongoing_funding_sources")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label>{t("fields.project_details.church_contribution.label")} *</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="project_details.church_contribution.مالية">{t("fields.project_details.church_contribution.financial")}</Label>
                            <Textarea id="project_details.church_contribution.مالية" rows={3} {...form.register("project_details.church_contribution.مالية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.church_contribution.بشرية">{t("fields.project_details.church_contribution.human")}</Label>
                            <Textarea id="project_details.church_contribution.بشرية" rows={3} {...form.register("project_details.church_contribution.بشرية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.church_contribution.عينية">{t("fields.project_details.church_contribution.in_kind")}</Label>
                            <Textarea id="project_details.church_contribution.عينية" rows={3} {...form.register("project_details.church_contribution.عينية")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="project_details.church_contribution.أخرى">{t("fields.project_details.church_contribution.other")}</Label>
                            <Textarea id="project_details.church_contribution.أخرى" rows={3} {...form.register("project_details.church_contribution.أخرى")} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="financials.previous_year_church_income">{t("fields.financials.previous_year_church_income.label")}</Label>
                        <Input id="financials.previous_year_church_income" type="number" min={0.01} step="0.01" {...form.register("financials.previous_year_church_income")} />
                      </div>
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="financials.previous_year_church_expenses">{t("fields.financials.previous_year_church_expenses.label")}</Label>
                        <Input id="financials.previous_year_church_expenses" type="number" min={0.01} step="0.01" {...form.register("financials.previous_year_church_expenses")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="additional_attachments">{t("fields.additional_attachments.label")}</Label>
                        <Textarea id="additional_attachments" rows={3} {...form.register("additional_attachments")} />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="applicant_signature_name">{t("fields.applicant_signature_name.label")} *</Label>
                        <Input id="applicant_signature_name" {...form.register("applicant_signature_name")} />
                      </div>

                      {/* File Upload Section */}
                      <div className="space-y-4 md:col-span-2">
                        <Label>{t("fields.attachments.label")}</Label>
                        <p className="text-sm text-muted-foreground m-0">{t("fields.attachments.help")}</p>
                        
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const files = Array.from(e.dataTransfer.files);
                            handleFiles(files);
                          }}
                          className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-[#2194D1]/50 hover:bg-[#2194D1]/5 transition-colors"
                        >
                          <Upload className={`w-8 h-8 text-muted-foreground mx-auto mb-3 ${isRTL ? "ml-0" : ""}`} />
                          <p className="text-sm text-muted-foreground">{t("fields.attachments.dragDrop")}</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => handleFiles(Array.from(e.target.files || []))}
                          />
                        </div>

                        {selectedFiles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{t("fields.attachments.selectedFiles")}:</p>
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-[#2194D1]" />
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-[#2194D1] hover:bg-[#2194D1]/90 h-14"
                    >
                      <Send className={`w-5 h-5 ${isRTL ? "ml-3" : "mr-3"}`} />
                      {isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
                    </Button>
                  </div>

                  {Object.keys(form.formState.errors).length ? (
                    <div className="text-sm text-muted-foreground">
                      {t("validationHint")}
                    </div>
                  ) : null}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
      <footer />
    </Layout>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default DevelopmentProjectRequestPage;

// Libs
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'

// Service
import { voucherService } from '@/services/voucher/voucher.service'

import { HttpStatus } from '@/constants/http.constants'
import { voucherValidation } from '@/validations/voucher.validation'

import { VoucherUsersGave } from '@/models/voucher-users-gave.model'

import { Voucher } from '@/models/voucher.model'
import { User } from '@/models/user.model'
//nodemailer service
import nodemailer from 'nodemailer'

export const voucherController = {
  createVoucher: asyncHandler(async (req: Request, res: Response) => {
    const { code, discountPercent } = req.body
    const validate = voucherValidation.voucherValidate({ code, discountPercent })
    if (Object.keys(validate).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid input' })
      return
    }

    const existing = await voucherService.findOne(code)
    if (existing) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Voucher code already exists' })
      return
    }

    const voucher = await voucherService.create({ code, discountPercent })

    res.status(HttpStatus.OK).json({ message: 'Voucher created successfully', data: voucher })
  }),

  getAllVoucher: asyncHandler(async (req: Request, res: Response) => {
    const vouchers = await voucherService.findAll()
    res.status(HttpStatus.OK).json({ message: 'Get all voucher successfully', data: vouchers })
  }),

  updateVoucher: asyncHandler(async (req: Request, res: Response) => {
    const voucherId = req.params.id
    const { code, discountPercent } = req.body

    const validate = voucherValidation.voucherValidate({ code, discountPercent })
    if (Object.keys(validate).length > 0) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid input' })
      return
    }

    const updatedVoucher = await voucherService.findAndUpdate(voucherId, { code, discountPercent })
    if (!updatedVoucher) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Voucher updated', data: updatedVoucher })
  }),

  deleteVoucher: asyncHandler(async (req: Request, res: Response) => {
    const voucherId = req.params.id

    const voucher = await voucherService.findAndDelete(voucherId)
    if (!voucher) {
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found' })
      return
    }

    res.status(HttpStatus.OK).json({ message: 'Voucher deleted successfully', data: voucher })
  }),

  sendVoucher: asyncHandler(async (req: Request, res: Response) => {
    const transposter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
      }
    });

    try {
      await transposter.verify();
      console.log('✅ Ready to send emails');
    } catch (error) {
      console.error('❌ Error verifying email transport:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Email service is not available' });
    }

    const {email, voucher_code} = req.body;
    
    if(!email || !voucher_code){
      res.status(HttpStatus.BAD_REQUEST).json({ message: 'Email and voucher code are required' });
      return;
    }
    
    const voucher = await Voucher.findOne({code: voucher_code});
    if(!voucher){
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Voucher not found!' });
      return;
    }

    const emailExists = await User.findOne({email: email});
    if(!emailExists){
      res.status(HttpStatus.NOT_FOUND).json({ message: 'Email not found!. Please check email again' });
      return;
    }

    // ngày hết hạn
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const formattedExpiryDate = expiryDate.toLocaleDateString('en-GB');

    // nội dung send email
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; line-height: 1.6">
        <h1 style="color: #d9534f; text-align: center;">🎉 Congratulations! 🎉</h1>
        <p style="font-size: 16px;">You have received an <strong style="color:black;">exclusive voucher</strong> from our store!</p>
        
        <div style="background-color: #f9f9f9; border: 2px dashed #5cb85c; padding: 15px; margin: 20px 0; text-align: center;border-radius:10px; padding: 10px">
          <p style="font-size: 18px; margin: 0;">Voucher Code:</p>
          <h2 style="color: #d9534f; margin: 5px 0;">${voucher.code}</h2>
          <p style="margin: 0; font-size: 16px;">Discount: <strong style="color: #0275d8;">${voucher.discountPercent}%</strong> off your next bill</p>
          <p style="margin: 0; font-size: 14px; color: black;">Valid until: <strong>${formattedExpiryDate}</strong></p>
        </div>

        <p>Please keep your voucher code <strong>safe</strong> and use it at checkout.</p>
        <p>We hope you enjoy your shopping experience with us!</p>
        
        <p style="margin-top: 30px;">Best regards,</p>
        <p style="font-weight: bold;">AUTHMANOR</p>
      </div>
    `;
    const mailOptions = {
      from: "AUTHMANOR",
      to: email,
      subject: '🎁 Your Exclusive Voucher is Here!',
      html: emailHTML 
    };
    try {
      const infor = await transposter.sendMail(mailOptions);
      await VoucherUsersGave.create({
        userId: emailExists._id,
        voucherId: voucher._id,
        date_end: formattedExpiryDate // Voucher valid for 30 days
      });
      res.status(HttpStatus.OK).json({ message: 'Voucher sent successfully'});
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to send voucher email'});
    }
  })
}

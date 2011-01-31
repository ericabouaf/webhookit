
# Cron Jobs

Wirings can be scheduled using the Cron Pattern.

## Usage

The cron pattern consists of six fields separated by spaces. The format is:

    [second] [minute] [hour] [day of month] [month] [day of week]
    
    
The allowed values for the cron pattern fields are described in the following table:

<table border="1" cellspacing="0" cellpadding="0">
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Field</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>Allowed Values</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Second</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>0-59</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Minute</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>0-59</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Hour</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>0-23</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Day of month</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>1-31</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="197" valign="top">
			<p>
				<span>Month</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>0-11 (0 = January)</span>
			</p>
		</td>
	</tr>
	<tr style='mso-yfti-irow:6;mso-yfti-lastrow:yes'>
		<td width="197" valign="top">
			<p>
				<span>Day of week</span>
			</p>
		</td>
		<td width="197" valign="top">
			<p>
				<span>1-7 (1 = Sunday)</span>
			</p>
		</td>
	</tr>
</table>
<p>
	<span>To configure each field, you can use one of the following options:</span>
</p>
<p>
	<span><span>●<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span> <span>An asterisk to run every instance of the value of the field.</span>
</p>
<p>
	<span>It is equivalent to the range [first-last]. For example, an asterisk in the <span class="Object">Month</span> field runs the job every month.</span>
</p>
<p>
	<span><span>●<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span> <span>A range.</span>
</p>
<p>
	<span>The specified range is inclusive. For example, to specify a run time between the hours of</span> <span>8:00</span> <span>and</span> <span>11:00</span> <span style='mso-ansi-language: EN-US'>the range of the <span class="Object">Hour</span> field would be [8-11] which is equivalent to [8,9,10,11].</span>
</p>
<p>
	<span><span>●<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span> <span>A set of numbers or ranges separated by commas.</span>
</p>
<p>
	<span>For example, if you enter [1,8-12,15] in the <span class="Object">Day of month</span> field, the job runs on the first, eighth, ninth, tenth, eleventh, twelfth, and fifteenth days of the month.</span>
</p>
<p>
	<span><span>●<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span></span> <span>A step, used with ranges.</span>
</p>
<p>
	<span>Enter "/" after a range to specify which values to use in the range. For example, [0-23/2] can be used in the <span class="Object">Hour</span> field to specify that a job runs every other hour. This is equivalent to specifying [0,2,4,6,8,10,12,14,16,18,20,22] in the <span class="Object">Hour</span> field. Steps are also permitted after an asterisk, so if you want to run the job every two hours, you could use [*/2].</span>
</p>
<h3>
	<span>Example</span>
</h3>
<p>
	<span>Examples of cron patterns are described in the following table:</span>
</p>
<table border="1" cellspacing="0" cellpadding="0">
	<tr>
		<td width="295" valign="top">
			<p>
				<span>Pattern</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Description</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>* * * * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs the job every second. None of the fields are restricted.</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>*/5 * * * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every five seconds, starting at second zero (that is, seconds 0,5,10,15,20,25,30,35,40,45,50,55)</span>
			</p>
		</td>
	</tr>
	<tr style='mso-yfti-irow:3;page-break-inside:avoid'>
		<td width="295" valign="top">
			<p>
				<span>0 * * * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every minute, on the first second of the minute</span>
			</p>
		</td>
	</tr>
	<tr style='mso-yfti-irow:4;page-break-inside:avoid'>
		<td width="295" valign="top">
			<p>
				<span>0 0 * * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every hour, on the first second of the minute and the first minute of the hour</span>
			</p>
		</td>
	</tr>
	<tr style='mso-yfti-irow:5;page-break-inside:avoid'>
		<td width="295" valign="top">
			<p>
				<span>0 0 */4 * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every four hours, starting with hour zero (that is, hours 0,4,8,12,16,20) on the first second of the minute and the first minute of the hour</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>00 30 11 * * *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every day at</span> <span>11:30:00 AM</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>00 30 11 * * 2-6</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs every weekday (Monday through Friday) at</span> <span>11:30:00 AM</span><span>. It does not run on Saturday or Sunday.</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>00 30 11 1 0,6 *</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs at</span> <span>11:30:00 AM</span> <span>on the first of January and first of July</span>
			</p>
		</td>
	</tr>
	<tr>
		<td width="295" valign="top">
			<p>
				<span>00 30 11 1 0 2</span>
			</p>
		</td>
		<td width="295" valign="top">
			<p>
				<span>Runs at</span> <span>11:30:00 AM</span> <span>on the first of January if it is Monday. It is uncommon to specify both a [Day of Month] and a [Day of Week], but it is allowed. This job runs every few years since the first of January is not always a Monday.</span>
			</p>
		</td>
	</tr>
</table>


<script type="text/javascript">var disqus_shortname = 'cron-jobs';</script>
